/**
 * Logger model
 *
 */
"use strict";
var Checkit       = require('checkit');
var bookshelf     = require('./index');
var moment        = require('moment');
var checkit       = new Checkit({
    nick    : ['required'],
    channel : ['required']
});

var Logger    = bookshelf.Model.extend({
    tableName  : "logs",
    
    defaults   : {
        enabled   : 1
    },
    
    initialize : function () {
        this.on('saving', this.validateSave);
    },
    
    validateSave: function () {
        return checkit.run(this.attributes);
    }
});

module.exports = Logger;









