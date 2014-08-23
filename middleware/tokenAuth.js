/**
 * Verifies token for all API requests
 *
 */
"use strict";

var Account        = require('../models/account');
var Bookshelf      = require('../models/index');
var jwt            = require('jwt-simple');

module.exports     = function (req, res, next) {
    var token   = (req.body && req.body.accessToken) || (req.query && req.query.accessToken) || req.headers['x-access-token'];
    
    var path    = req.originalUrl;
    var isLogin = path.indexOf('/login') !== -1;
    
    if (isLogin) {
        next();
        
        return;
    }
    
    if (token) {
        console.log('processing token: ' + token);
        
        try {
            var config  = req.app.get('config');
            var decoded = jwt.decode(token, config.tokenSecret);
            var expired = decoded.exp <= Date.now();
            
            if (!expired) {
                var model = new Account({
                    id: decoded.iss
                });
                
                console.log('fetching account with id: ', decoded.iss);
                
                model.fetch()
                     .then(function (result) {
                        if (result) {
                            req.user = result;
                            
                            next();
                            
                        } else {
                            next({
                                status : "ERROR",
                                message: "Access token invalid.",
                                handler: function (req, res, next) {
                                    res.status(400).json({
                                        status : "ERROR",
                                        message: "Access token invalid."
                                    });
                                }
                            });
                        }
                    });
            } else {
                next({
                    status : "ERROR",
                    message: "Access token expired.",
                    handler: function (req, res, next) {
                        res.status(400).json({
                            status : "ERROR",
                            message: "Access token expired."
                        });
                    }
                });
            }
        } catch (err) {
            console.log('error processing token: ', err);
            
            return next();
        }
    } else {
        next({
            status : 401,
            message: "Access token invalid."
        });
    }
};