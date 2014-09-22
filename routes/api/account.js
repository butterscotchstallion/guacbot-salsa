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
var mailer             = require('../../app/accountActivationEmailer');
var Handlebars         = require('handlebars');
var emailTemplate      = fs.readFileSync('./views/accounts/activation-email.html', 'utf8');

function sendSuccessResponse (res, model) {
    res.status(201).json({
        status : "OK",
        message: "Account created.",
        account: {
            name                    : model.get('name'),
            email                   : model.get('email'),
            guid                    : model.get('guid'),
            created_at              : model.get('created_at'),
            updated_at              : model.get('updated_at'),
            active                  : model.get('active'),
            password_change_required: model.get('password_change_required'),
            activation_code         : model.get('activation_code')
        }
    });
}

// Create account
router.post('/', function (req, res, next) {
    var name     = req.param('name');
    var email    = req.param('email');
    var testing  = req.param('testing');
    
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
            var activationCode = uuid.v4();
            var activationLink = config.baseActivationURL + "/accounts/activate/" + activationCode;
            
            model.set({
                name                    : name,
                email_address           : email,
                password                : hash,
                guid                    : uuid.v4(),
                activation_code         : activationCode,
                active                  : 0,
                password_change_required: 1
            });
            
            model.save()
                 .then(function (result) {
                    var newAccount = result;
                    
                    res.location(['/accounts', 
                                  newAccount.get('guid')].join('/'));
                    
                    // Don't send activation email when testing
                    if (!testing) {
                        // Send activation email
                        var tmp       = Handlebars.compile(emailTemplate);
                        var emailBody = tmp(_.extend({
                            activationLink: activationLink
                        }, newAccount.toJSON()));
                        
                        mailer.send({
                            mailUsername: config.mailUsername,
                            mailPassword: config.mailPassword,
                            from        : config.mailFrom,
                            to          : email,
                            subject     : config.activationEmailSubject,
                            text        : emailBody,
                            html        : emailBody,
                            callback    : function (mailError, info) {
                                if (mailError) {
                                    console.log(mailError);
                                    
                                    res.status(500).json({
                                        status: "ERROR",
                                        message: IS_DEV ? mailError : "Error sending activation email."
                                    });
                                    
                                } else {
                                    if (IS_DEV) {
                                        console.log('Message sent: ' + info.response);
                                    }
                                    
                                    sendSuccessResponse(res, newAccount);
                                }
                            }
                        });
                    } else {
                        sendSuccessResponse(res, newAccount);
                    }
                 })
                 .catch(function (error) {
                    var errorMessage  = "Error creating account.";
                    
                    console.log(error);
                    
                    res.status(200).json({
                        status: "ERROR",
                        message: IS_DEV ? error : errorMessage
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

// Suggest account name
router.get('/suggest-name', function (req, res, next) {
    var qb       = Bookshelf.knex
                            .select(['word', 'type'])
                            .from('english_words');
    
    qb.debug();
    
    qb.then(function (words) {
        var adjectives = _.find(words, function (w) {
            return w.type === "adjective";
        });
        
        var nouns = _.find(words, function (w) {
            return w.type === "noun";
        });
        
        var rndAdj  = adjectives[~~(Math.random()) * adjectives.length].word;
        var rndNoun = nouns[~~(Math.random()) * nouns.length].word;
        var word    = rndAdj + rndNoun;
        
        res.status(200).json({
            status : "OK",
            message: null,
            name   : word
        });
    })
    .catch(function (error) {
        console.log(error);
        
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

// Activate account
router.put('/activate', function (req, res, next) {
    var code     = req.param('activationCode');
    var password = req.param('password');
    
    console.log(req.body);
    
    /**
     * Make sure we are only affecting accounts with this activation 
     * code, and accounts that are currently inactive
     *
     */
    var model    = new Account({ 
        activation_code: code,
        active         : 0
    });
    
    model.fetch({
        require: true,
        debug  : true
    })
    .then(function (result) {        
        passwordHasher(password).hash(function (error, hash) {
            if (error) {
                res.status(200).json({
                    status: "ERROR",
                    message: IS_DEV ? error : "Error activating account."
                });
            } else {   
                /** 
                 * Make user active and set their new password
                 *
                 */
                model.set({
                    active                  : 1,
                    password                : hash,
                    password_change_required: 0
                });
                
                model.save()
                     .then(function () {
                        res.status(200).json({
                            status: "OK",
                            message: "Account activated."
                        });
                     })
                     .catch(function (error) {
                        res.status(200).json({
                            status: "ERROR",
                            message: IS_DEV ? error : "Error activating account."
                        });
                    });
            }
        });
    })
    .catch(function (error) {
        console.log(error);
        
        res.status(200).json({
            status: "ERROR",
            message: IS_DEV ? error : "Error activating account."
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