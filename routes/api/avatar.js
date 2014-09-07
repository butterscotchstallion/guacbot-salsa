/**
 * account avatar routes
 *
 */
"use strict";

var express             = require('express');
var router              = express.Router();
var jwt                 = require('jwt-simple');
var passwordHasher      = require('password-hash-and-salt');
var moment              = require('moment');
var fs                  = require('fs');
var Bookshelf           = require('../../models/index');
var config              = JSON.parse(fs.readFileSync("./config/api.json", 'utf8'));
var AccountAccessToken  = require('../../models/accountAccessToken');
var Account             = require('../../models/account');
var IS_DEV              = config.env === "development";
var _                   = require('underscore');
var path                = require('path');
var easyimage           = require('easyimage');
var uuid                = require('node-uuid');

// Create
router.post('/', function(req, res) {
    var avatar             = req.files ? req.files.avatar : false;
    var oneMegabyteInBytes = 1000000;
    var uploadPath         = path.resolve(config.uploadPath);
    var options            = {
        uploadDir      : uploadPath,
        uploadUrl      : '/images/avatars/',
        maxPostSize    : oneMegabyteInBytes,
        minFileSize    : 1,
        maxFileSize    : oneMegabyteInBytes,
        acceptFileTypes: /.+/i,
        inlineFileTypes: /\.(gif|jpe?g|png)/i,
        imageTypes     :  /\.(gif|jpe?g|png)/i
    };
    var uploader = require('blueimp-file-upload-expressjs')(options);
    
    uploader.post(req, res, function (response) {
        var avatar = response.files[0];
        var ext;
        
        switch (avatar.type) {
            default:
            case "image/jpeg":
                ext = "jpg";
            break;
            
            case "image/png":
                ext = "png";
            break;
            
            case "image/gif":
                ext = "gif";
            break;
        }
        
        var filename        = uuid.v4()  + ext;
        var src             = uploadPath + "/"           + filename;
        var dst             = uploadPath + "/thumbnail/" + filename;
        var width           = 290;
        var height          = 290;
        
        // But wait, uploader plugin named the files according to 
        // what the user sent. Let's rename that.
        var oldPath         = uploadPath + "/" + avatar.name;
        var newPath         = src;
        
        // Overwrite the old filename. The URLs that the plugin generates
        // will be wrong, so we also have to overwrite those.
        avatar.name         = filename;
        avatar.url          = config.avatarPath + filename;
        avatar.thumbnailUrl = config.avatarPath + "thumbnail/" + filename;
        
        fs.rename(oldPath, newPath, function (err) {
            if (err) {
                console.log("error renaming: ", err);
            }
            
            // Create thumbnail
            easyimage.resize({
                src    : src,
                dst    : dst,
                width  : width,
                height : height,
                quality: 100
            }).then(function () {
                /**
                 * req.account is provided by the tokenAuth middleware. This is used
                 * to update the account avatar based on the account ID available
                 * from req.account. Also, since the account is looked up by the access
                 * token, it is not possible to update someone else's avatar!
                 *
                 */
                var account   = req.account;
                var accountID = account.id;
                var qb        = Bookshelf.knex('accounts');
                var now       = moment().format('YYYY-MM-DD HH:mm:ss');
                
                qb.where({
                    id: accountID
                })
                .update({
                    avatar_filename: filename,
                    updated_at     : now
                })
                .then(function () {
                    var oldAvatarPath          = uploadPath + "/"           + account.avatar_filename;
                    var oldAvatarThumbnailPath = uploadPath + "/thumbnail/" + account.avatar_filename;
                    
                    // Delete old avatar
                    fs.unlink(oldAvatarPath, function (err) {
                        if (err) {
                            console.log("error deleting " + oldAvatarThumbnailPath);
                        } else {
                            console.log("deleted " + oldAvatarThumbnailPath);
                        }
                    });
                    
                    // Delete old avatar thumbnail
                    fs.unlink(oldAvatarThumbnailPath, function (err) {
                        if (err) {
                            console.log("error deleting " + oldAvatarThumbnailPath);
                        } else {
                            console.log("deleted " + oldAvatarThumbnailPath);
                        }
                    });
                    
                    res.status(201).json({
                        status : "OK",
                        message: null,
                        avatar : avatar
                    });
                });
            },
            function (err) {
                if (IS_DEV) {
                    console.log("Error creating thumbnail: ", err);
                }
                
                res.status(200).json({
                    status : "ERROR",
                    message: "Error creating avatar."
                });
            });
        });
    });
});






module.exports = router;