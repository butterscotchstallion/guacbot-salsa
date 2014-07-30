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

// Information about a single nick
router.get('/nick/:nick', function (req, res, next) {
    var qb       = Bookshelf.knex('logs');
    var urlParts = url.parse(req.url, true).query;  
    
    qb.where({ nick: req.params.nick });
    
    var channel = urlParts.channel;
    
    console.log('urlparts: ', urlParts);
    
    if (channel && channel.length > 0) {
        qb.where({
            channel: channel
        });
    }
    
    qb.limit(1)
      .orderBy('ts', 'desc')
      .then(function (info) {
            res.json(200, {
                status : "OK",
                info   : info[0]
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