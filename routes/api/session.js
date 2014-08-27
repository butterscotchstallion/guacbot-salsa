/**
 * session routes
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

// Read
router.get('/', function(req, res) {
    var token        = req.headers["x-access-token"];
    var errorMessage = "Session expired";
    
    if (token) {
        var qb = Bookshelf.knex("account_access_tokens");
        
        qb.where({
            token : token,
            active: 1
        });
        
        qb.then(function (result) {
            if (result && result.length > 0) {
                res.status(200).json({
                    status : "OK",
                    session: result[0]
                });
            } else {
                res.status(404).json({
                    status : "ERROR",
                    message: "Session not found."
                });
            }
          })
          .catch(function (error) {
            res.status(404).json({
                status : "ERROR",
                message: "Session not found."
            });
        });          
    } else {
        res.status(200).json({
            status : "OK",
            message: errorMessage
        });
    }
});

// Create
router.post('/', function (req, res, next) {
    var name         = req.param('name');
    var password     = req.param('password') || "";
    var tokenModel   = new AccountAccessToken();
    var model        = new Account({
        name: name
    });
    var crypticError = "Invalid account name or password.";
    var errorMessage = crypticError;
    
    model.fetch()
         .then(function (account) {
            if (account) {
                var pw = account.get('password');
                
                // Verify password
                passwordHasher(password).verifyAgainst(pw, function(error, validated) {
                    if (error || !validated) {
                        res.status(200).json({
                            status  : "ERROR",
                            message : error || crypticError
                        });
                    } else {
                        // No sensitive details!
                        // TODO: use select to specify the column
                        // rather than just setting the property to null
                        account.set('password', null);
                        
                        var eMoment = moment().add(config.tokenDurationPeriod, 
                                                   config.tokenDurationUnit);
                        var expires = eMoment.valueOf();
                        
                        var token   = jwt.encode({
                            iss: account.get('id'),
                            exp: expires
                        }, config.tokenSecret);
                        
                        var expiresFormatted = eMoment.format("YYYY-MM-DD HH:mm:s");
                        var ip               = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                        
                        tokenModel.set({
                            token            : token,
                            expires_at       : expiresFormatted,
                            account_id       : account.get('id'),
                            origin_ip_address: ip
                        });
                        
                        tokenModel.save()
                                  .then(function () {
                                    res.status(201).json({
                                        status : "OK",
                                        message: "Session created.",
                                        account: account,
                                        session: {
                                            token            : token,
                                            expires_at       : expires,
                                            origin_ip_address: ip
                                        }
                                    });
                                  })
                                  .catch(function (error) {
                                        if (config.env === "development") {
                                            errorMessage = error;
                                        }
                                        
                                        res.status(200).json({
                                            status: "ERROR",
                                            message: errorMessage
                                        });
                                  });
                    }
                });
                
            } else {
                if (config.env === "development") {
                    errorMessage = 'Account does not exist: "' + name + '".';
                }
                
                res.status(200).json({
                    status : "ERROR",
                    message: errorMessage
                });
            }
         })
         .catch(function (error) {
            if (config.env === "development") {
                errorMessage = error;
            }
            
            res.status(200).json({
                status: "ERROR",
                message: errorMessage
            });
        });
});

// Update
router.put('/', function (req, res, next) {
    var token     = req.headers["x-access-token"];
    var active    = req.param('active');    
    var model     = new AccountAccessToken({ 
        token: token
    });
    
    var options = { 
        patch: true, 
        debug: true 
    };
    
    model.fetch({
            require: true
         })
         .then(function (result) {
            if (result) {
                model.save({
                    active: active
                }, options)
                .then(function () {                        
                    res.location("/session");
                    
                    res.status(200).json({
                        status : "OK",
                        message: "Session updated"
                    });
                })
                .catch(function (error) {
                    res.status(200).json({
                        status: "ERROR",
                        message: error
                    });
                });
            } else {
                res.status(404).json({
                    status: "ERROR",
                    message: "Session not found."
                });
            }
        });
});

// Delete
router.delete('/', function (req, res, next) {
    var token      = req.headers["x-access-token"];

    var tokenModel = new AccountAccessToken({
        token: token 
    });
    
    tokenModel.fetch()
              .then(function (model) {                    
                if (model) {                    
                    tokenModel.destroy()
                             .then(function (message) {
                                res.status(200).json({
                                    status       : "OK",
                                    message      : "Session destroyed."
                                });
                            })
                            .catch(function (error) {
                                res.status(200).json({
                                    status: "ERROR",
                                    message: error
                                });
                            });
                } else {
                    res.status(404).json({
                        status: "ERROR",
                        message: "Error destroying session."
                    });
                }
            });
});

module.exports = router;















