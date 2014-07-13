/**
 * Plugin messages
 *
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('plugin-messages/list', { 
        title               : 'Plugin Messages - List',
        isPluginMessagesPage: true
    });
});

router.get('/:pluginMessageID', function(req, res) {
    res.render('plugin-messages/message', { 
        title               : 'Plugin Message - Edit',
        isPluginMessagesPage: true,
        pluginMessageID     : req.params.pluginMessageID
    });
});

module.exports = router;
