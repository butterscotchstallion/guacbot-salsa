/**
 * logger API routes
 *
 */
var express       = require('express');
var moment        = require('moment');
var router        = express.Router();
var pluginMessage = require('../../models/pluginMessage');
var logger        = require('../../models/logger');
var Bookshelf     = app.get('bookshelf');
var url           = require('url');

// Messages!
router.get('/messages', function (req, res, next) {
    var qb       = Bookshelf.knex('logs');
    var urlParts = url.parse(req.url, true).query;  
    var channel  = urlParts.channel;
    var nick     = urlParts.nick;
    var limit    = parseInt(urlParts.limit, 10) || 1;
    var query    = urlParts.query;
    
    if (nick && nick.length > 0) {
        qb.where({ nick: nick });
    }
    
    if (channel && channel.length > 0) {
        qb.where({ channel: '#' + channel });
    }
    
    if (limit && limit > 0) {
        qb.limit(limit);
    }
    
    if (query && query.length > 0) {
        qb.where('message', 'like', '%' + query + '%');
    }
    
    qb.orderBy('ts', 'desc')
        .then(function (messages) {
            res.json(200, {
                status  : "OK",
                messages: messages
            });
        })
        .catch(function (error) {
            res.json(200, {
                status: "ERROR",
                message: error
            });
        });
});

module.exports = router;