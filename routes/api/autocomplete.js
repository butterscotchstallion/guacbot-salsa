/**
 * autocomplete API routes
 *
 */
var express       = require('express');
var moment        = require('moment');
var _             = require('underscore');
var router        = express.Router();
var plugin        = require('../../models/plugin');
var Bookshelf     = require('../../models/index');
var url           = require('url');

router.get('/plugins', function (req, res, next) {
    var urlParts = url.parse(req.url, true).query;
    var query    = urlParts.query;
    var Plugin   = new plugin();

    Plugin.query()
          .where('name', 'LIKE', query)
          //.debug()
          .then(function (results) {
            res.json(200, {
                status : "OK",
                plugins: results
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