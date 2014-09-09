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
var IS_DEV             = config.env === "development";
var _                  = require('underscore');

// Read
router.get('/', function(req, res) {
    var token        = req.headers["x-access-token"];
    var errorMessage = "Session expired";
    
    if (token) {
        var qb = Bookshelf.knex("account_access_tokens");
        
        //qb.debug();
        
        qb.select([
            "account_access_tokens.token",
            "account_access_tokens.created_at",
            "account_access_tokens.updated_at",
            "account_access_tokens.expires_at",
            "account_access_tokens.origin_ip_address",
            "account_access_tokens.user_agent",
            
            "accounts.active",
            "accounts.id AS accountID",
            "accounts.name AS accountName",
            "accounts.created_at AS accountCreatedAt",
            "accounts.updated_at AS accountUpdatedAt"
        ]);
        
        // Match token and ensure both token
        // and account are active
        qb.where({
            "account_access_tokens.token" : token,
            "account_access_tokens.active": 1,
            "accounts.active"             : 1
        });
        
        // Ensure we're only fetching tokens which have not yet expired
        var now = moment().format('YYYY-MM-DD HH:mm:ss');
        
        qb.where('account_access_tokens.expires_at', '>', now);
        
        // Include account info
        qb.innerJoin('accounts', 'accounts.id', 'account_access_tokens.account_id');
        
        qb.then(function (result) {
            if (result && result.length > 0) {
                var token = result[0];
                
                res.status(200).json({
                    status : "OK",
                    session: _.extend({
                        account: {
                            id        : token.accountID,
                            name      : token.accountName,
                            created_at: token.accountCreatedAt,
                            updated_at: token.accountUpdatedAt,
                            active    : token.active
                        }
                    }, token)
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
                message: IS_DEV ? error : "Session not found."
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
                    var invalidPassword = error || !validated;
                    
                    if (invalidPassword) {
                        res.status(200).json({
                            status  : "ERROR",
                            message : error || crypticError
                        });
                    } else {
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
                        var userAgent        = req.headers["user-agent"] || "";
                        
                        tokenModel.set({
                            token            : token,
                            expires_at       : expiresFormatted,
                            origin_ip_address: ip,
                            user_agent       : userAgent,
                            account_id       : account.get('id')
                        });
                        
                        tokenModel.save()
                                  .then(function () {
                                    var response = {
                                        status : "OK",
                                        message: "Session created.",
                                        account: account.toJSON(),
                                        session: {
                                            token            : token,
                                            expires_at       : expires,
                                            origin_ip_address: ip,
                                            user_agent       : userAgent,
                                            guid             : account.get('guid')
                                        }
                                    };
                                    
                                    console.log(response);
                                    
                                    res.status(201).json(response);
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
        patch: true 
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
















