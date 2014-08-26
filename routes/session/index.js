/**
 * session routes
 *
 */
"use strict";

var express        = require('express');
var router         = express.Router();
var jwt            = require('jwt-simple');
var passwordHasher = require('password-hash-and-salt');
var moment         = require('moment');
var fs             = require('fs');
var config         = JSON.parse(fs.readFileSync("./config/api.json", 'utf8'));

// Login page
router.get('/new', function(req, res) {
    res.render('accounts/login', { 
        title     : "Salsa - Login",
        env       : config.env
    });
});

module.exports = router;
















