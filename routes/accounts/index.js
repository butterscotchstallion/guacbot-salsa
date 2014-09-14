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

// New
router.get('/new', function(req, res) {
    res.render('accounts/new', { 
        title         : "New Account",
        env           : config.env,
        isAccountsArea: true
    });
});

// New
router.get('/new/account-created', function(req, res) {
    res.render('accounts/created', { 
        title         : "Account Created!",
        env           : config.env,
        isAccountsArea: true
    });
});

// Profile
router.get('/:guid', function(req, res) {
    res.render('accounts/profile', { 
        title         : "Account Profile",
        env           : config.env,
        isAccountsArea: true,
        guid          : req.params.guid
    });
});


module.exports = router;
















