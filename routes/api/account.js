/**
 * account API routes
 *
 */
var express            = require('express');
var moment             = require('moment');
var router             = express.Router();
var Account            = require('../../models/account');
var Bookshelf          = require('../../models/index');
var AccountAccessToken = require('../../models/accountAccessToken');
var passwordHasher     = require('password-hash-and-salt');
var url                = require('url');
var _                  = require('underscore');
var jwt                = require('jwt-simple');
var fs                 = require('fs');
var config             = JSON.parse(fs.readFileSync("./config/api.json", 'utf8'));

// Create account
router.post('/', function (req, res, next) {
    var name     = req.param('name');
    var password = req.param('password');
    var model    = new Account();
    
        passwordHasher(password).hash(function (error, hash) {
            if (error) {
                res.status(200).json({
                    status: "ERROR",
                    message: error
                });
            } else {
                model.set({
                    name    : name,
                    password: hash
                });
                
                model.save()
                     .then(function (result) {
                        var newAccount = result;
                        
                        // No sensitive details in the response!
                        newAccount.set('password', null);
                        
                        res.location(['/accounts', 
                                      newAccount.get('id')].join('/'));
                        
                        res.status(201).json({
                            status : "OK",
                            message: "Account created.",
                            account: newAccount
                        });
                     })
                     .catch(function (error) {
                        var errorMessage  = "Error creating account.";
                        
                        res.status(200).json({
                            status: "ERROR",
                            message: error
                        });
                    });
            }
        });
});

// Account by ID
router.get('/:accountID', function (req, res, next) {    
    var accountID    = req.params.accountID;
    var accountModel = new Account({
        id: accountID
    });
    var tokenModel   = new AccountAccessToken();
    
    /**
     * Fetch an account, and any associated access tokens if the account exists
     *
     */
    accountModel.fetch()
                .then(function (result) {
                    if (result) {
                        result.set('password', null);
                        
                        tokenModel.fetchAll({
                            where: {
                                account_id: req.params.accountID
                            }
                        })
                        .then(function (tokens) {
                            var account = result;
                            
                            // Add tokens to account object
                            account.set('tokens', tokens.toJSON());
                            
                            res.status(200).json({
                                status : "OK",
                                message: null,
                                account: account
                            });
                        })
                        .catch(function (error) {
                            res.status(200).json({
                                status : "ERROR",
                                message: "Error fetching tokens."
                            });
                        });
                    } else {
                        res.status(404).json({
                            status : "ERROR",
                            message: "Account not found."
                        });
                    }
                })
                .catch(function (error) {
                    res.status(404).json({
                        status: "ERROR",
                        message: error
                    });
                });
});

// Log in
router.post('/login', function (req, res, next) {
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
                
                console.log('verifying ' + password + ' against ' + pw);
                
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

// Update account
router.put('/:accountID', function (req, res, next) {
    var accountID = req.params.accountID;
    var active    = req.param('active');    
    var model     = new Account({ 
        id: accountID
    });
    
    var options = { patch: true };
    
    model.fetch()
         .then(function (result) {
            if (result) {
                model.save({
                    active: active
                }, options)
                .then(function (model) {                        
                    res.location(['/accounts', model.get('id')].join('/'));
                    
                    res.status(200).json({
                        status : "OK",
                        message: "Account updated"
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
                    message: "Account not found"
                });
            }
        });
});

// Delete account
router.delete('/:accountID', function (req, res, next) {
    var model = new Account({
        id: req.params.accountID
    });
    
    model.fetch()
           .then(function (result) {
                if (result) {                    
                    result.destroy()
                           .then(function (message) {
                                res.status(200).json({
                                    status       : "OK",
                                    message      : "Account deleted."
                                });
                            })
                            .catch(function (error) {
                                res.status(200).json({
                                    status: "ERROR",
                                    message: "Error deleting account."
                                });
                            });            
                } else {
                    res.status(404).json({
                        status: "ERROR",
                        message: "Account not found."
                    });
                }
            });
});


module.exports = router;