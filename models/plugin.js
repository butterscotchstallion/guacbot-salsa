/**
 * Plugin model
 *
 */
"use strict";
var Checkit       = require('checkit');
var bookshelf     = app.get('bookshelf');

var textRules     = ["required", "alphaNumeric"];
var checkit       = new Checkit({
    display_name: textRules,
    filename    : textRules
});

var Plugin    = bookshelf.Model.extend({
    tableName  : "plugins",
    
    defaults   : {
        enabled: 1
    },
    
    initialize : function () {
        this.on('saving', this.validateSave);
    },
    
    validateSave: function () {
        return checkit.run(this.attributes)
                      .catch(Checkit.Error, function (err) {
                        var error = err.toJSON();
                        
                        console.log(error);
                      });
    }
});

module.exports = Plugin;









