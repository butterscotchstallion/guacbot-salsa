/**
 * API routes
 *
 */
var express       = require('express');
var router        = express.Router();
var pluginMessage = require('../../models/pluginMessage');
//var plugin      = require('../models/plugin');

// A single message
router.get('/plugin-messages/:pluginMessageID', function (req, res, next) {
    var PluginMessage = new pluginMessage();
    
    PluginMessage.query('where', 'id', '=', req.params.pluginMessageID)
                 .fetch({
                    withRelated: ['plugin']
                 })
                 .then(function (message) {
                    if (!message) {
                        next('No such plugin');
                    }
                    
                    var message = message.toJSON();
                    
                    res.json(message);
                })
                .catch(function (err) {
                    console.log('error: ' + err);
                    next(err);
                });
});

router.get('/plugin-messages/:pluginMessageID/related', function (req, res, next) {
    var PluginMessage = new pluginMessage();
    
    // There is probably a better way to do this but I'm going to query to get
    // the plugin ID of this plugin message, then use that ID to get all the
    // plugin messages with that plugin ID
    PluginMessage.query('where', 'id', '=', req.params.pluginMessageID)
                 .fetch()
                 .then(function (model) {
                    var pluginID = model.get('plugin_id');
 
                    PluginMessage.query('where', 'plugin_id', '=', pluginID)
                                 .fetchAll({
                                    withRelated: ['plugin']
                                 })
                                 .then(function (message) {
                                    if (!message) {
                                        next('No such plugin');
                                    }
                                    
                                    var message = message.toJSON();
                                    
                                    res.json(message);
                                })
                                .catch(function (err) {
                                    console.log('error: ' + err);
                                    next(err);
                                });
                 });
});

router.get('/plugin-messages', function(req, res) {
    var url    = require('url');
    var parts  = url.parse(req.originalUrl, true);
    var query  = parts.query;
    
    var PluginMessage = new pluginMessage();
    
    PluginMessage.fetchAll({
                    withRelated: ['plugin']
                })
                 .then(function (messages) {
                    var messagesJSON = messages.toJSON();
                    
                    res.json(messages);
                    //res.send(JSON.stringify(messages, null, 4));
                });
});

module.exports = router;

