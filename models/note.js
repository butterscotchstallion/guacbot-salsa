/**
 * Note model
 *
 */
"use strict";

var Checkit       = require('checkit');
var bookshelf     = require('./index');
var checkit       = new Checkit({
    origin_nick: ['required'],
    dest_nick  : ['required'],
    message    : ['required'],
    channel    : ['required']
});

var Note    = bookshelf.Model.extend({
    tableName    : "notes",
    
    hasTimestamps: ['created_at'],
    
    initialize   : function () {
        this.on('saving', this.validateSave);
    },
    
    validateSave : function () {
        return checkit.run(this.attributes);
    }
});

module.exports = Note;









