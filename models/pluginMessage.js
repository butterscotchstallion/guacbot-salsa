/**
 * Plugin Messages model
 *
 */
"use strict";

var Checkit       = require('checkit');
var bookshelf     = app.get('bookshelf');
var plugin        = require('../models/plugin'); 

var Plugin        = new plugin();

var checkit       = new Checkit({
    message: ["required", "alphaNumeric"],
    name   : ["required", "alphaNumeric"]
});

var PluginMessage = bookshelf.Model.extend({
    initialize : function () {
        this.on('saving', this.validateSave);
    },
    
    validateSave: function () {
        return checkit.run(this.attributes)
                      .catch(Checkit.Error, function (err) {
                        console.log(err.toJSON());
                      });
    },
    
    idAttribute: 'id',
    
    tableName  : "plugin_messages",
    
    plugin     : function () {
        return this.belongsTo(plugin, 'plugin_id');
    }
});

module.exports = PluginMessage;

