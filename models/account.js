/**
 * account model
 *
 */
"use strict";

var Checkit       = require('checkit');
var bookshelf     = require('./index');
var checkit       = new Checkit({
    name: ['required']
});

var account    = bookshelf.Model.extend({
    tableName    : "accounts",
    
    hasTimestamps: ['created_at', 'updated_at'],
    
    defaults     : {
        active: 1
    },
    
    initialize   : function () {
        this.on('saving', this.validateSave);
    },
    
    validateSave : function () {
        return checkit.run(this.attributes);
    }
});

module.exports = account;









