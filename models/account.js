/**
 * account model
 *
 */
"use strict";

var Checkit       = require('checkit');
var bookshelf     = require('./index');
var password      = require('password-hash-and-salt');
var fs            = require('fs');
var config        = JSON.parse(fs.readFileSync("./config/api.json", 'utf8'));
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
        this.on('saving', this.beforeSave);
    },
    
    beforeSave : function (model) {
        var pw   = model.get('password');
        var self = this;
        
        password(pw).hash(function (error, hash) {
            if (error) {
                return error;
            }
            
            model.set('password', hash);
            
            return checkit.run(self.attributes);        
        });
    }
});

module.exports = account;









