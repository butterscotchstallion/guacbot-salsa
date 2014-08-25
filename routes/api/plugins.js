/**
 * plugin API routes
 *
 */
var express       = require('express');
var moment        = require('moment');
var router        = express.Router();
var pluginMessage = require('../../models/pluginMessage');
var plugin        = require('../../models/plugin');
var Bookshelf     = require('../../models/index');
var url           = require('url');
var _             = require('underscore');

// All plugins
router.get('/', function (req, res, next) {
    var urlParts = url.parse(req.url, true).query;
    var order    = urlParts.order || "name";
    var cols     = [
        "id",
        "name",
        "filename",
        "enabled"
    ];
    var qb       = Bookshelf.knex
                            .select(cols)
                            .from('plugins');
    
    if (cols.indexOf(order) !== -1) {
        qb.orderBy(order, "DESC");
    }
    
    qb.then(function (plugins) {
        res.status(200).json({
            status  : "OK",
            message : null,
            plugins : plugins || []
        });
    })
    .catch(function (error) {
        res.status(200).json({
            status: "ERROR",
            message: error
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
                res.status(200).json({
                    status : "OK",
                    message: null,
                    plugin : plugin
                });
            } else {
                res.status(404).json({
                    status: "ERROR",
                    message: "Plugin not found"
                });
            }
          });
});

// Info about a specific plugin
router.get('/:pluginID/info', function (req, res, next) {
    var Plugin = new plugin();
    
    Plugin.query({
        where: {
            plugin_id: req.params.pluginID
        }
    })
    .count('* AS messageCount')
    .then(function (result) {
        var plugin = result[0];
        
        console.log(plugin);
        
        /*Plugin.query({
                where: {
                    id: req.params.pluginID
                }
              })
              .fetch()
              .then(function (plugin) {*/
                if (plugin) {
                    res.status(200).json({
                        status : "OK",
                        message: null,
                        plugin : plugin
                    });
                } else {
                    res.status(404).json({
                        status: "ERROR",
                        message: "Plugin not found"
                    });
                }
             // });
    });
});

// Create plugin
router.post('/', function (req, res, next) {
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
            
            res.status(201).json({
                status : "OK",
                message: "Plugin created successfully",
                id     : parseInt(model.get('id'), 10)
            });
          })
            .catch(function (error) {
                res.status(200).json({
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
                            
                            res.status(200).json({
                                status : "OK",
                                message: "Plugin updated"
                            });
                        })
                        .catch(function (error) {
                            res.status(200).json({
                                status: "ERROR",
                                message: error
                            });
                        });
            } else {
                res.status(404).json({
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
                            res.status(200).json({
                                status       : "OK",
                                message      : "Plugin deleted successfully."
                            });
                        })
                        .catch(function (error) {
                            res.status(200).json({
                                status: "ERROR",
                                message: error
                            });
                        });
                } else {
                    res.status(404).json({
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
            
            res.status(201).json({
                status: "OK",
                message: "Plugin message created successfully",
                id     : id
            });
          })
            .catch(function (error) {
                res.status(200).json({
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
                            
                            res.status(200).json({
                                status : "OK",
                                message: "Plugin message updated"
                            });
                        })
                        .catch(function (error) {
                            res.status(200).json({
                                status: "ERROR",
                                message: error
                            });
                        });
            } else {
                res.status(404).json({
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
    var limit         = parseInt(urlParts.limit, 10)  || null;
    var offset        = parseInt(urlParts.offset, 10) || null;
    var name          = urlParts.name;
    var query         = urlParts.query;
    var cols          = [
        'plugin_messages.id AS id',
        'plugin_messages.message AS message',
        'plugin_messages.plugin_id AS plugin_id',
        'plugin_messages.created_at AS created_at',
        'plugin_messages.name AS name',
        'plugins.id AS pluginID',
        'plugins.filename',
        'plugins.enabled'
    ];
    
    var qb         = Bookshelf.knex
                                 .select(cols)
                                 .from('plugin_messages');
    
    qb.where({
        plugin_id: req.params.pluginID
    });
    
    if (limit > 0) {
        qb.limit(limit);
    }
    
    if (offset > 0) {
        qb.offset(offset);
    }
    
    if (name && name.length > 0) {
        qb.where({
            "plugin_messages.name": name
        });
    }
    
    if (query && query.length > 0) {
        qb.where("message", 'LIKE', '%' + query + '%');
    }
    
    qb.innerJoin('plugins', 'plugin_messages.plugin_id', 'plugins.id')
         .then(function (messages) {
                res.status(200).json({
                    status: "OK",
                    message: null,
                    messages: messages
                });
         });
});

// Plugin message info
router.get('/:pluginID/messages/info', function (req, res, next) {
    var urlParts     = url.parse(req.url, true).query;
    var itemsPerPage = parseInt(urlParts.itemsPerPage, 10) || 10;
    
    Bookshelf.knex('plugin_messages')
             .where({
                    plugin_id: req.params.pluginID                    
                 })
                 .count('* AS messageCount')
                 .then(function (result) {
                    if (result && result[0]) {
                        /**
                         * Use total message count to generate an array of page numbers
                         * for use with pagination
                         *
                         */
                        var pages    = [];
                        var numPages = Math.floor(result[0].messageCount / itemsPerPage);
                        
                        for (var j = 0; j < numPages; j++) {
                            pages.push((j+1));
                        }
                        
                        // Combine total messages result with other pertinent information
                        var info = _.extend(result[0], {
                            pages: pages
                        });
                        
                        res.status(200).json({
                            status : "OK",
                            message: null,
                            info   : info
                        });
                    } else {
                        res.status(200).json({
                            status       : "ERROR",
                            message      : "Error retrieving message info"
                        });
                    }
                });
});

// Names
router.get('/:pluginID/messages/names', function (req, res, next) {
    Bookshelf.knex
             .distinct()
             .select('name')
             .from('plugin_messages')
             .where({
                    plugin_id: req.params.pluginID                    
                 })
                 .then(function (result) {
                    res.status(200).json({
                        status : "OK",
                        message: null,
                        names  : result
                    });                   
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
                        res.status(200).json({
                            status       : "OK",
                            message      : null,
                            pluginMessage: message
                        });
                    } else {
                        res.status(404).json({
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
                                        res.status(200).json({
                                            status       : "OK",
                                            message      : "Plugin message deleted successfully."
                                        });
                                    })
                                    .catch(function (error) {
                                        res.status(200).json({
                                            status: "ERROR",
                                            message: error
                                        });
                                    });
                    } else {
                        res.status(404).json({
                            status: "ERROR",
                            message: "Message not found"
                        });
                    }
                });
});

module.exports = router;



