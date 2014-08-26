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
var AccountAccessToken = require('../../models/accountAccessToken');
var Account            = require('../../models/account');

// New session
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
                        account.set('password', null);
                        
                        var eMoment = moment().add(config.tokenDurationPeriod, 
                                                   config.tokenDurationUnit);
                        var expires = eMoment.valueOf();
                        
                        var token   = jwt.encode({
                            iss: account.get('id'),
                            exp: expires
                        }, config.tokenSecret);
                        
                        var expiresFormatted = eMoment.format("YYYY-MM-DD HH:mm:s");
                        
                        tokenModel.set({
                            token     : token,
                            expires_at: expiresFormatted,
                            account_id: account.get('id')
                        });
                        
                        tokenModel.save()
                                  .then(function () {
                                    res.status(200).json({
                                        status : "OK",
                                        message: "Session created.",
                                        account: account,
                                        token  : token,
                                        expires: expires
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

// Delete session
router.delete('/', function (req, res, next) {
    var token      = req.headers["x-access-token"];
    
    console.log(req.headers);
    
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
















