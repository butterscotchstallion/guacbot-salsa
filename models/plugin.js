/**
 * Plugin model
 *
 */
"use strict";
var Checkit       = require('checkit');
var bookshelf     = require('./index');
var moment        = require('moment');
var checkit       = new Checkit({
    name    : ['required'],
    filename: ['required']
});

var Plugin    = bookshelf.Model.extend({
    tableName  : "plugins",
    
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

module.exports = Plugin;









