/**
 * API routes
 *
 */
var express       = require('express');
var router        = express.Router();
var pluginMessage = require('../../models/pluginMessage');
var plugin        = require('../../models/plugin');

require('./plugins');

module.exports = router;

