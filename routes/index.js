/**
 * Application startup
 *
 */
"use strict";

var express       = require('express');
var router        = express.Router();
var db            = require('../app/db');
var pluginMessage = require('../models/pluginMessage');
var plugin        = require('../models/plugin');

// Init db
//db.init(config, function () {
//    console.log('connected');
//});

router.get('/', function(req, res) {
    res.render('index', { 
        title     : "Salsa",
        isHomepage: true        
    });
});

router.get('/plugin-messages', function(req, res) {
    res.render('plugin-messages/list', { 
        title               : 'Plugin Messages - List',
        isPluginMessagesPage: true
    });
});

// API
router.get('/api/:version/plugin-messages/list', function(req, res) {
    var url    = require('url');
    var parts  = url.parse(req.originalUrl, true);
    var query  = parts.query;
    
    var PluginMessage = new pluginMessage();
    
    PluginMessage.fetchAll({
                    withRelated: ['plugin']
                })
                 .then(function (messages) {
                    var messagesJSON = messages.toJSON().sort(function (a, b) {
                        return a.filename < b.filename;
                    }).reverse();
                    
                
                    res.json(messages);
                });
});

module.exports = router;
















