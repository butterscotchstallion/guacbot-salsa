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
var uuid               = require('node-uuid');

// Create account
router.post('/', function (req, res, next) {
    var name     = req.param('name');
    var email    = req.param('email');
    // This will be overwritten when the user follows the activation process
    // Also, the account will be inactive by default so it will not be possible
    // to log in, even if this password was known. It is set for the sole purpose
    // of passing validation.
    var password = "" + ~~(Math.random() * 9999);
    var model    = new Account();
    
    passwordHasher(password).hash(function (error, hash) {
        if (error) {
            res.status(200).json({
                status: "ERROR",
                message: error
            });
        } else {
            model.set({
                name                    : name,
                email_address           : email,
                password                : hash,
                guid                    : uuid.v4(),
                activation_code         : uuid.v4(),
                active                  : 0,
                password_change_required: 1
            });
            
            model.save()
                 .then(function (result) {
                    var newAccount = result;
                    
                    res.location(['/accounts', 
                                  newAccount.get('guid')].join('/'));
                    
                    res.status(201).json({
                        status : "OK",
                        message: "Account created.",
                        account: {
                            name                    : newAccount.get('name'),
                            email                   : newAccount.get('email'),
                            guid                    : newAccount.get('guid'),
                            created_at              : newAccount.get('created_at'),
                            updated_at              : newAccount.get('updated_at'),
                            active                  : newAccount.get('active'),
                            password_change_required: newAccount.get('password_change_required'),
                            activation_code         : newAccount.get('activation_code')
                        }
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

// Account by GUID
router.get('/:guid', function (req, res, next) {    
    var guid         = req.params.guid
    var accountModel = new Account({
        guid  : guid,
        active: 1
    });
    
    /**
     * Fetch an account, and any associated access tokens if the account exists
     *
     */
    accountModel.fetch({
                    require: true
                })
                .then(function (result) {
                    result.set('password', null);
                    
                    var account = result;
                    
                    res.status(200).json({
                        status : "OK",
                        message: null,
                        account: account
                    });
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
        "guid",
        "name",
        "active",
        "created_at",
        "updated_at"
    ];
    
    var qb       = Bookshelf.knex
                            .select(cols)
                            .from('accounts');
    var urlParts = url.parse(req.url, true).query;
    var name     = urlParts.name;
    var email    = urlParts.email;
    var facets   = urlParts.facets;
    
    if (name && name.length > 0) {
        qb.where({
            name: name
        });
    }
    
    if (email && email.length > 0) {
        qb.where({
            email_address: email
        });
    }
    
    qb.orderBy('created_at', 'DESC');
    
    qb.then(function (result) {
        var payload = {
            status : "OK",
            message: null,
            accounts: result
        };
        
        // Used for validation
        if (facets && facets.indexOf('valid') !== -1) {
            payload.valid = result.length === 0;
        }
        
        res.status(200).json(payload);
    })
    .catch(function (error) {
        res.status(200).json({
            status: "ERROR",
            message: IS_DEV ? error : "Error fetching accounts."
        });
    });
});

// Update account
router.put('/:guid', function (req, res, next) {
    var guid   = req.params.guid;
    var active = req.param('active');    
    var model  = new Account({ 
        guid: guid
    });
    
    var options = { patch: true };
    
    model.fetch()
         .then(function (result) {
            if (result) {
                model.save({
                    active: active
                }, options)
                .then(function (model) {                        
                    res.location(['/accounts', model.get('guid')].join('/'));
                    
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
router.delete('/:guid', function (req, res, next) {
    var guid = req.params.guid;
    var model = new Account({
        guid: guid
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