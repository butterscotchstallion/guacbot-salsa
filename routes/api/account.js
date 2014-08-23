/**
 * account API routes
 *
 */
var express        = require('express');
var moment         = require('moment');
var router         = express.Router();
var Account        = require('../../models/account');
var Bookshelf      = require('../../models/index');
var passwordHasher = require('password-hash-and-salt');
var url            = require('url');
var _              = require('underscore');
var jwt            = require('jwt-simple');
var fs             = require('fs');
var config         = JSON.parse(fs.readFileSync("./config/api.json", 'utf8'));

// Create account
router.post('/', function (req, res, next) {
    var name     = req.param('name');
    var password = req.param('password');
    var model    = new Account();
    
    model.set({
        name    : name,
        password: password
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
                message: errorMessage
            });
        });
});

// Account by ID
router.get('/:accountID', function (req, res, next) {
    var model = new Account();
    
    model.query({
        where: {
            id: req.params.accountID
        }
    })
    .fetch({
        required: true       
    })
    .then(function (result) {
        result.set('password', null);
        
        res.status(200).json({
            status : "OK",
            message: null,
            account: result
        });    
    })
    .catch(function (error) {
        res.status(404).json({
            status: "ERROR",
            message: "Account not found"
        });
    });
});

// Log in
router.post('/login', function (req, res, next) {
    var name     = req.param('name');
    var password = req.param('password');
    var model    = new Account({
        name: name
    });
    
    model.fetch({
            required: true
         })
         .then(function (account) {
            if (account) {
                // No sensitive details!
                account.set('password', null);
                
                var expires = moment().add(config.tokenDurationPeriod, 
                                           config.tokenDurationUnit).valueOf();
                
                var token = jwt.encode({
                    iss: account.get('id'),
                    exp: expires
                }, config.tokenSecret);
                
                res.status(200).json({
                    status : "OK",
                    message: "Session created.",
                    account: account,
                    token  : token,
                    expires: expires
                });
            } else {
                res.status(200).json({
                    status : "ERROR",
                    message: "Account does not exist." 
                });
            }
         })
         .catch(function (error) {
            var errorMessage  = "Invalid account name or password.";
            
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