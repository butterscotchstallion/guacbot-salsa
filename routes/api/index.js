/**
 * API routes
 *
 */
var express       = require('express');
var router        = express.Router();
var pluginMessage = require('../../models/pluginMessage');
var plugin        = require('../../models/plugin');

// Create plugin message
router.post('/plugins/:pluginID/messages', function (req, res, next) {
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
            res.location(['/plugins', 
                          req.params.pluginID,
                          'messages',
                          model.id].join('/'));
            
            res.send(201, null);
          })
            .catch(function (error) {
                res.send(200, {
                    status: "ERROR",
                    message: error
                });
            });
});

// Save plugin message
router.put('/plugins/:pluginID/messages/:messageID', function (req, res, next) {
    var message   = req.param('message');
    var messageID = req.param('messageID');
    var pluginID  = req.param('pluginID');
    
    if (message.trim().length === 0) {
        res.send(200, { status: "ERROR", message: "Message cannot be blank" });
    } else {
        var model     = new pluginMessage({ 
            id: messageID
        });
        
        var options = { patch: true };
        
        model.save({
                message  : message,
                id       : messageID,
                plugin_id: pluginID
              }, options)
              .then(function (model) {
                res.location(['/plugins', 
                              req.params.pluginID,
                              'messages',
                              req.params.messageID].join('/'));
                
                res.send(201, null);
              });
    }
});

// All plugins
router.get('/plugins', function (req, res, next) {
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
router.get('/plugins/:pluginID', function (req, res, next) {
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

// All messages for this plugin
router.get('/plugins/:pluginID/messages', function (req, res, next) {
    var PluginMessage = new pluginMessage();
    
    PluginMessage.query({
                    where: {
                        plugin_id: req.params.pluginID
                     }
                 })
                 .fetchAll({
                    withRelated: ['plugin']
                 })
                 .then(function (message) {
                    if (!message) {
                        next('No such plugin');
                    }
                    
                    var message = message.toJSON();
                    
                    res.json(message);
                });
});

// Message by ID
router.get('/plugins/:pluginID/messages/:pluginMessageID', function (req, res, next) {
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
                    if (!message) {
                        next('No such plugin');
                    }
                    
                    var message = message.toJSON();
                    
                    res.json(message);
                });
});

module.exports = router;

