/**
 * routes
 *
 */
"use strict";

var express = require('express');
var router  = express.Router();
var fs      = require('fs');
var config  = JSON.parse(fs.readFileSync("./config/db-dev.json", 'utf8'));

router.get('/', function(req, res) {
    res.render('index', { 
        title     : "Salsa",
        isHomepage: true        
    });
});

module.exports = router;
















