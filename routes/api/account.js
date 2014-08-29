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
var IS_DEV             = config.env === "development";

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
    var accountID    = parseInt(req.params.accountID, 10);
    var accountModel = new Account({
        id: accountID
    });
    var tokenModel   = new AccountAccessToken();
    
    if (!accountID || accountID < 1) {
        res.status(404).json({
            status : "ERROR",
            message: "Account not found."
        });
        
        return;
    }
    
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

// List of accounts
router.get('/', function (req, res, next) {
    var cols = [
        "id",
        "name",
        "active",
        "created_at",
        "updated_at"
    ];
    
    var qb       = Bookshelf.knex
                            .select(cols)
                            .from('accounts');
    
    qb.then(function (result) {
        res.status(200).json({
            status : "OK",
            message: null,
            accounts: result
        });
    })
    .catch(function (error) {
        res.status(200).json({
            status: "ERROR",
            message: IS_DEV ? error : "Error fetching accounts."
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
    var accountID = req.params.accountID;
    var model = new Account({
        id: accountID
    });
    
    model.fetch({
        require: true
    })
    .then(function (result) {         
        model.destroy()
               .then(function () {
                    res.status(200).json({
                        status       : "OK",
                        message      : "Account deleted."
                    });
                })
                .catch(function (error) {
                    res.status(200).json({
                        status: "ERROR",
                        message: IS_DEV ? error : "Error deleting account."
                    });
                });
    })
    .catch(function (error) {
        res.status(200).json({
            status: "ERROR",
            message: IS_DEV ? error : "Error deleting account."
        });
    });
});


module.exports = router;