/**
 * plugin API routes
 *
 */
var express       = require('express');
var moment        = require('moment');
var router        = express.Router();
var pluginMessage = require('../../models/pluginMessage');
var plugin        = require('../../models/plugin');

// All plugins
router.get('/', function (req, res, next) {
    var Plugin = new plugin();
    
    Plugin.fetchAll()
          .then(function (plugin) {
                if (!plugin) {
                    next('No such plugin');
                }
                    
                var plugin = plugin.toJSON();
                
                res.json(plugin);
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
                if (!plugin) {
                    next('No such plugin');
                }
                
                res.json(plugin);
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
            
            res.send(201, {
                status : "OK",
                message: "Plugin created successfully",
                id     : parseInt(model.get('id'), 10)
            });
          })
            .catch(function (error) {
                res.send(200, {
                    status: "ERROR",
                    message: error
                });
            });
});

/**
 * Plugin Messages
 *
 */

// Create plugin message
router.post('/:pluginID/messages', function (req, res, next) {
    var pluginID  = req.param('pluginID');
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
            
            res.send(201, {
                status: "OK",
                message: "Plugin message created successfully",
                id     : id
            });
          })
            .catch(function (error) {
                res.send(200, {
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
    
    var model     = new pluginMessage({ 
        id: messageID
    });
    
    var options = { patch: true };
    
    model.save({
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
            
            res.send(200, {
                status : "OK",
                message: "Plugin message updated"
            });
          })
          .catch(function (error) {
            res.send(200, {
                status: "ERROR",
                message: error
            });
        });
});

// All messages for this plugin
router.get('/:pluginID/messages', function (req, res, next) {
    var PluginMessage = new pluginMessage();
    
    PluginMessage.query({
                    where: {
                        plugin_id: req.params.pluginID
                    }
                 })
                 .fetchAll({
                    withRelated: ['plugin']
                 })
                 .then(function (messages) {
                    res.json(200, {
                        status: "OK",
                        message: null,
                        messages: messages
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
                    withRelated: ['plugin']
                 })
                 .then(function (message) {
                    res.json(200, {
                        status       : "OK",
                        message      : null,
                        pluginMessage: message
                    });
                });
});

module.exports = router;



