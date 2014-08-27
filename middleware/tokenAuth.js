/**
 * Verifies token for all API requests
 *
 */
"use strict";

var Account            = require('../models/account');
var AccountAccessToken = require('../models/accountAccessToken');
var Bookshelf          = require('../models/index');
var jwt                = require('jwt-simple');

module.exports  = function (req, res, next) {
    var token   = req.headers['x-access-token'];    
    var path    = req.originalUrl;
    var isLogin = path.indexOf('session') !== -1;
    
    if (isLogin) {
        next();        
        return;
    }
    
    var sendErrorResponse = function (resp) {
        //res.status(400).json(resp);
        next(resp);
    };
    
    if (token) {
        try {
            var config   = req.app.get('config');
            var decoded  = jwt.decode(token, config.tokenSecret);
            var expired  = decoded.exp <= Date.now();
            
            if (!expired) {
                var model = new AccountAccessToken({
                    account_id: decoded.iss
                });
                
                model.fetchAll()
                     .then(function (result) {
                        if (result && result.length > 0) {
                            req.account = result;
                            
                            next();                            
                        } else {
                            sendErrorResponse({
                                status: 400,
                                message: "Access token not found."
                            });
                        }
                    });
            } else {
                sendErrorResponse({
                    status: 400,
                    message: "Access token expired."
                });
            }
        } catch (err) {
            sendErrorResponse({
                status: 400,
                message: config.env === "development" ? err : "Invalid access token."
            });
        }
    } else {
        sendErrorResponse({
            status: 400,
            message: "Access token required."
        });
    }
};