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

module.exports = router;
