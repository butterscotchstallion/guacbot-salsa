/**
 * routes
 *
 */
"use strict";

var express = require('express');
var router  = express.Router();
var fs      = require('fs');
var config  = JSON.parse(fs.readFileSync("./config/api.json", 'utf8'));

// List
router.get('/', function(req, res) {
    res.render('accounts/list', { 
        title         : "Accounts",
        env           : config.env,
        isAccountsArea: true
    });
});

// Profile
router.get('/:accountID', function(req, res) {
    res.render('accounts/profile', { 
        title         : "Account Profile",
        env           : config.env,
        isAccountsArea: true,
        accountID     : req.params.accountID
    });
});

module.exports = router;
















