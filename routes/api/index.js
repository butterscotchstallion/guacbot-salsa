/**
 * API routes
 *
 */
var express       = require('express');
var router        = express.Router();
var pluginMessage = require('../../models/pluginMessage');
var plugin        = require('../../models/plugin');

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

