/**
 * account avatar routes
 *
 */
"use strict";

var express            = require('express');
var router             = express.Router();
var jwt                = require('jwt-simple');
var passwordHasher     = require('password-hash-and-salt');
var moment             = require('moment');
var fs                 = require('fs');
var Bookshelf          = require('../../models/index');
var config             = JSON.parse(fs.readFileSync("./config/api.json", 'utf8'));
var AccountAccessToken = require('../../models/accountAccessToken');
var Account            = require('../../models/account');
var IS_DEV             = config.env === "development";
var _                  = require('underscore');

// Create
router.post('/', function(req, res) {
    
});








module.exports = router;