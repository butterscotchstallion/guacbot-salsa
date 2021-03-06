/**
 * account access token model
 *
 */
"use strict";

var Checkit       = require('checkit');
var bookshelf     = require('./index');
var checkit       = new Checkit({
    token     : ['required'],
    expires_at: ['required'],
    account_id: ['required']
});

var model    = bookshelf.Model.extend({
    tableName    : "account_access_tokens",
    
    hasTimestamps: ['created_at', 'updated_at'],
    
    defaults     : {
        active: 1
    },
    
    token        : function () {
        return this.belongsTo("accounts", 'account_id');
    },
    
    initialize   : function () {
        this.on('saving', this.beforeSave);
    },
    
    beforeSave   : function (model) {
        return checkit.run(this.attributes);
    }
});

module.exports = model;









