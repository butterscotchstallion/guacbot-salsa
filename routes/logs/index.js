/**
 * logs routes
 *
 */
"use strict";

var express = require('express');
var router  = express.Router();
var fs      = require('fs');
var config  = JSON.parse(fs.readFileSync("./config/api.json", 'utf8'));

// List
router.get('/', function(req, res) {
    res.render('logs/index', { 
        title     : "Logs",
        env       : config.env,
        isLogsArea: true
    });
});

module.exports = router;