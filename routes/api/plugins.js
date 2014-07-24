/**
 * plugin API routes
 *
 */
var express       = require('express');
var moment        = require('moment');
var router        = express.Router();
var pluginMessage = require('../../models/pluginMessage');
var plugin        = require('../../models/plugin');
var Bookshelf     = app.get('bookshelf');
var url           = require('url');

// All plugins
router.get('/', function (req, res, next) {
    var Plugin = new plugin();
    
    Plugin.fetchAll()
          .then(function (plugins) {
                res.json(200, {
                    status  : "OK",
                    message : null,
                    plugins : plugins || []
                });
          });
});

// A specific plugin
router.get('/:pluginID', function (req, res, next) {
    var Plugin = new plugin();
    
    Plugin.query({
            where: {
                id: req.params.pluginID
            }
          })
          .fetch()
          .then(function (plugin) {
            if (plugin) {
                res.json(200, {
                    status : "OK",
                    message: null,
                    plugin : plugin
                });
            } else {
                res.json(404, {
                    status: "ERROR",
                    message: "Plugin not found"
                });
            }
          });
});

// Create plugin
router.post('/', function (req, res, next) {
    var pluginID = req.param('pluginID');
    var filename = req.param('filename');
    var name     = req.param('name');
    
    var model    = new plugin();        

    model.save({
            filename: filename,
            name    : name
          })
          .then(function (model) {
            res.location(['/plugins', 
                          model.get('id')].join('/'));
            
            res.json(201, {
                status : "OK",
                message: "Plugin created successfully",
                id     : parseInt(model.get('id'), 10)
            });
          })
            .catch(function (error) {
                res.json(200, {
                    status: "ERROR",
                    message: error
                });
            });
});

// Update plugin 
router.put('/:pluginID', function (req, res, next) {
    var message   = req.param('message');
    var name      = req.param('name');
    var enabled   = req.param('enabled');
    var pluginID  = req.params.pluginID;
    
    var Plugin  = new plugin({ 
        id: pluginID
    });
    
    var options = { patch: true };

    Plugin.fetch()
         .then(function (model) {
            if (model) {
                Plugin.save({
                            id     : pluginID,
                            name   : name,
                            enabled: enabled
                        }, options)
                        .then(function (model) {                        
                            res.location(['/plugins', pluginID].join('/'));
                            
                            res.json(200, {
                                status : "OK",
                                message: "Plugin updated"
                            });
                        })
                        .catch(function (error) {
                            res.json(200, {
                                status: "ERROR",
                                message: error
                            });
                        });
            } else {
                res.json(404, {
                    status: "ERROR",
                    message: "Plugin not found"
                });
            }
        });
});

// Delete Plugin by ID
router.delete('/:pluginID', function (req, res, next) {
    var Plugin = new plugin({
        id: req.params.pluginID
    });
    
    Plugin.fetch()
          .then(function (model) {                    
                if (model) {                    
                    Plugin.destroy()
                         .then(function (message) {
                            res.json(200, {
                                status       : "OK",
                                message      : "Plugin deleted successfully."
                            });
                        })
                        .catch(function (error) {
                            res.json(200, {
                                status: "ERROR",
                                message: error
                            });
                        });
                } else {
                    res.json(404, {
                        status: "ERROR",
                        message: "Plugin not found"
                    });
                }
            });
});

/**
 * Plugin Messages
 *
 */

// Create plugin message
router.post('/:pluginID/messages', function (req, res, next) {
    var pluginID  = req.params.pluginID;
    var message   = req.param('message');
    var name      = req.param('name');
    
    var model   = new pluginMessage();        
    var options = {};
    
    model.save({
            message  : message,
            name     : name,
            plugin_id: pluginID
          }, options)
          .then(function (model) {
            var id = model.get('id');
            
            res.location(['/plugins', 
                          req.params.pluginID,
                          'messages',
                          id].join('/'));
            
            res.json(201, {
                status: "OK",
                message: "Plugin message created successfully",
                id     : id
            });
          })
            .catch(function (error) {
                res.json(200, {
                    status: "ERROR",
                    message: error
                });
            });
});

// Update plugin message
router.put('/:pluginID/messages/:messageID', function (req, res, next) {
    var message   = req.param('message');
    var name      = req.param('name');
    var messageID = req.params.messageID;
    var pluginID  = req.params.pluginID;
    
    var PluginMessage  = new pluginMessage({ 
        id       : messageID,
        plugin_id: pluginID
    });
    
    var options = { patch: true };
    
    PluginMessage.fetch()
         .then(function (model) {
            if (model) {
                PluginMessage.save({
                            message  : message,
                            id       : messageID,
                            plugin_id: pluginID,
                            name     : name
                        }, options)
                        .then(function (model) {                        
                            res.location(['/plugins', 
                                      pluginID,
                                      'messages',
                                      messageID].join('/'));
                            
                            res.json(200, {
                                status : "OK",
                                message: "Plugin message updated"
                            });
                        })
                        .catch(function (error) {
                            res.json(200, {
                                status: "ERROR",
                                message: error
                            });
                        });
            } else {
                res.json(404, {
                    status: "ERROR",
                    message: "Message not found"
                });
            }
        });
});

// All messages for this plugin
router.get('/:pluginID/messages', function (req, res, next) {
    var PluginMessage = new pluginMessage();
    var urlParts      = url.parse(req.url, true).query;
    var limit         = parseInt(urlParts.limit, 10) || null;
    
    if (limit !== null) {
        Bookshelf.knex('plugin_messages')
                 .where({
                    plugin_id: req.params.pluginID
                 })
                 .limit(limit)
                 .innerJoin('plugins', 'plugin_messages.plugin_id', 'plugins.id')
                 .then(function (messages) {
                    res.json(200, {
                        status: "OK",
                        message: null,
                        messages: messages
                    });
                });
    } else {
        Bookshelf.knex('plugin_messages')
                 .where({
                    plugin_id: req.params.pluginID
                 })
                 .innerJoin('plugins', 'plugin_messages.plugin_id', 'plugins.id')
                 .then(function (messages) {
                    res.json(200, {
                        status: "OK",
                        message: null,
                        messages: messages
                    });
                });
    }
});

// Plugin message info
router.get('/:pluginID/messages/info', function (req, res, next) {
    Bookshelf.knex('plugin_messages')   
             .where({
                    plugin_id: req.params.pluginID                    
                 })
                 .count('* AS messageCount')
                 .then(function (result) {
                    var info = result[0];
                    
                    if (info) {
                        res.json(200, {
                            status : "OK",
                            message: null,
                            info   : info
                        });
                    } else {
                        res.json(500, {
                            status       : "ERROR",
                            message      : "Error retrieving message info"
                        });
                    }
                });
});

// Message by ID
router.get('/:pluginID/messages/:pluginMessageID', function (req, res, next) {
    var PluginMessage = new pluginMessage();
    
    PluginMessage.query({
                    where: {
                        id       : req.params.pluginMessageID,
                        plugin_id: req.params.pluginID
                     }
                 })
                 .fetch({
                    required: true,
                    withRelated: ['plugin']
                 })
                 .then(function (message) {
                    if (message) {
                        res.json(200, {
                            status       : "OK",
                            message      : null,
                            pluginMessage: message
                        });
                    } else {
                        res.json(404, {
                            status       : "ERROR",
                            message      : "Plugin message not found"
                        });
                    }
                });
});

// Delete Message by ID
router.delete('/:pluginID/messages/:pluginMessageID', function (req, res, next) {
    var PluginMessage = new pluginMessage({
        id       : req.params.pluginMessageID,
        plugin_id: req.params.pluginID
    });
    
    PluginMessage.fetch()
                 .then(function (model) {                    
                    if (model) {                    
                        PluginMessage.destroy()
                                     .then(function (message) {
                                        res.json(200, {
                                            status       : "OK",
                                            message      : "Plugin message deleted successfully."
                                        });
                                    })
                                    .catch(function (error) {
                                        res.json(200, {
                                            status: "ERROR",
                                            message: error
                                        });
                                    });
                    } else {
                        res.json(404, {
                            status: "ERROR",
                            message: "Message not found"
                        });
                    }
                });
});

module.exports = router;



