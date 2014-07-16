/**
 * Plugins
 *
 */
var express = require('express');
var router = express.Router();

router.get('/:pluginID', function(req, res) {
    res.render('plugins/index', { 
        title               : 'Plugin',
        isPluginsPage       : true,
        isPluginMessagesPage: true,
        pluginID            : req.params.pluginID
    });
});

router.get('/:pluginID/messages', function(req, res) {
    res.render('plugins/messages/list', { 
        title               : 'Plugin Messages - List',
        isPluginsPage       : true,
        isPluginMessagesPage: true,
        pluginID            : req.params.pluginID
    });
});

router.get('/:pluginID/messages/add', function(req, res) {
    res.render('plugins/messages/add', { 
        title               : 'Plugin Messages - Add',
        isPluginMessagesPage: true,
        pluginID            : req.params.pluginID
    });
});

router.get('/:pluginID/messages/:pluginMessageID', function(req, res) {
    res.render('plugins/messages/index', { 
        title               : 'Plugin Message - Edit',
        isPluginMessagesPage: true,
        isPluginsPage       : true,
        pluginMessageID     : req.params.pluginMessageID,
        pluginID            : req.params.pluginID
    });
});

module.exports = router;
