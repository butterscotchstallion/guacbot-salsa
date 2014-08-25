/**
 * routes
 *
 */
"use strict";

var express = require('express');
var router  = express.Router();
var fs      = require('fs');
var config  = JSON.parse(fs.readFileSync("./config/api.json", 'utf8'));

router.get('/login', function(req, res) {
    res.render('accounts/login', { 
        title     : "Salsa - Login",
        env       : config.env
    });
});

router.get('/:accountID', function(req, res) {
    res.render('accounts/profile', { 
        title     : "Salsa - Account Profile",
        env       : config.env
    });
});

module.exports = router;
















