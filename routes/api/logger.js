/**
 * logger API routes
 *
 */
var express       = require('express');
var moment        = require('moment');
var _             = require('underscore');
var router        = express.Router();
var pluginMessage = require('../../models/pluginMessage');
var logger        = require('../../models/logger');
var Bookshelf     = app.get('bookshelf');
var url           = require('url');

router.get('/messages/count', function (req, res, next) {
    var qb       = Bookshelf.knex('logs');
    var urlParts = url.parse(req.url, true).query;
    var nick     = urlParts.nick;
    var channel  = urlParts.channel;
    var month    = urlParts.month;
    var result   = {
        status: "OK"
    };
    
    qb.count('* AS total');
    
    if (nick && nick.length > 0) {
        qb.where({
            nick: nick
        });
        
        result['nick'] = nick;
    }
    
    if (channel && channel.length > 0) {
        var hashChannel = '#' + channel;
        
        qb.where({
            channel: hashChannel
        });
        
        result['channel'] = hashChannel;
    }
    
    if (month) {
        var curMonth = moment().month(month);        
        var start    = moment(curMonth).format(moment.ISO_8601);
        var end      = moment(curMonth).add(1, 'month').format(moment.ISO_8601);
        
        //qb.whereBetween('ts', [start, end]);
        qb.where();
        
        result['month'] = month;
    }
    
    qb.debug();
    
    qb.then(function (countResult) {
        res.json(200, _.extend({
            total: countResult[0].total
        }, result));
    })
    .catch(function (error) {
        res.json(200, {
            status: "ERROR",
            message: error
        });
    });
});
    
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