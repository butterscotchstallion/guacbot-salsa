/**
 * note API routes
 *
 */
var express       = require('express');
var moment        = require('moment');
var _             = require('underscore');
var router        = express.Router();
var note          = require('../../models/note');
var Bookshelf     = require('../../models/index');
var url           = require('url');

// Create a note
router.post('/', function (req, res, next) {
    var originNick = req.param('originNick');
    var destNick   = req.param('destNick');    
    var channel    = req.param('channel');    
    var message    = req.param('message'); 
    var model      = new note();
    
    model.save({
            origin_nick: originNick,
            dest_nick  : destNick,
            channel    : channel,
            message    : message
          })
          .then(function (model) {
            res.location(['/notes', 
                          model.get('id')].join('/'));
            
            res.json(201, {
                status : "OK",
                message: "Note created successfully",
                id     : parseInt(model.get('id'), 10)
            });
          })
          .catch(function (error) {
                console.log(error);
                
                res.json(200, {
                    status: "ERROR",
                    message: error
                });
          });
});

// A specific note
router.get('/:noteID', function (req, res, next) {
    var qb     = Bookshelf.knex('notes');
    var id     = req.params.noteID;
    var result = {
        status: "OK"
    };
    
    qb.where({
        id: id
    });
    
    qb.then(function (note) {
            console.log(note[0]);
        
            res.json(200, _.extend({
                note: note[0]
            }, result));
        })
        .catch(function (error) {
            res.json(200, {
                status: "ERROR",
                message: error
            });
        });
});

// List notes
router.get('/', function (req, res, next) {
    var qb        = Bookshelf.knex('notes');
    var urlParts  = url.parse(req.url, true).query;
    var origin    = urlParts.originNick;
    var dest      = urlParts.destNick;
    var channel   = urlParts.channel;
    var limit     = parseInt(urlParts.limit, 10);
    var result    = {
        status: "OK"
    };
    
    if (origin && origin.length > 0) {
        qb.where({
            origin_nick: origin
        });
        
        result['originNick'] = origin;
    }
    
    if (dest && dest.length > 0) {
        qb.where({
            dest_nick: dest
        });
        
        result['destNick'] = dest;
    }
    
    if (channel && channel.length > 0) {
        qb.where({
            channel: '#' + channel
        });
        
        result['channel'] = '#' + channel;
    }
    
    if (limit && limit > 0) {
        qb.limit(limit);
        
        result['limit'] = limit;
    }
        
    qb.then(function (notes) {
            res.json(200, _.extend({
                notes: notes
            }, result));
        })
        .catch(function (error) {
            res.json(200, {
                status: "ERROR",
                message: error
            });
        });
});

module.exports = router;