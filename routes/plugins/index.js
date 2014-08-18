/**
 * Plugins
 *
 */
var express = require('express');
var router  = express.Router();
var fs      = require('fs');
var config  = JSON.parse(fs.readFileSync("./config/db-dev.json", 'utf8'));

router.get('/:pluginID', function(req, res) {
    var isMetaAvailable = false;
    var pluginID        = req.params.pluginID;
    var plugins         = {
        logger: 1
    };
    
    var pluginsWithMeta = [
        plugins.logger
    ];
    
    isMetaAvailable = pluginsWithMeta.indexOf(pluginID) !== -1;
    
    res.render('plugins/index', { 
        title               : 'Plugin',
        isPluginsPage       : true,
        isPluginMessagesPage: true,
        isMetaAvailable     : isMetaAvailable,
        pluginID            : pluginID,
        env                 : config.env
    });
});

router.get('/:pluginID/meta', function(req, res) {
    res.render('plugins/meta/index', { 
        title     : 'Plugin :: Meta',
        isMetaPage: true,
        pluginID  : req.params.pluginID,
        database            : config.database,
        env                 : config.env
    });
});

router.get('/:pluginID/messages', function(req, res) {
    res.render('plugins/messages/list', { 
        title               : 'Plugin Messages - List',
        isPluginsPage       : true,
        isPluginMessagesPage: true,
        pluginID            : req.params.pluginID,
        database            : config.database,
        env                 : config.env
    });
});

router.get('/:pluginID/messages/add', function(req, res) {
    res.render('plugins/messages/add', { 
        title               : 'Plugin Messages - Add',
        isPluginMessagesPage: true,
        isPluginsPage       : true,
        pluginID            : req.params.pluginID,
        database            : config.database,
        env                 : config.env
    });
});

router.get('/:pluginID/messages/:pluginMessageID', function(req, res) {
    console.log(config);
    
    res.render('plugins/messages/index', { 
        title               : 'Plugin Message - Edit',
        isPluginMessagesPage: true,
        isPluginsPage       : true,
        pluginMessageID     : req.params.pluginMessageID,
        pluginID            : req.params.pluginID,
        database            : config.database,
        env                 : config.env
    });
});

module.exports = router;
