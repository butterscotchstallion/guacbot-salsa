/**
 * Plugin Messages model
 *
 */
"use strict";

var Checkit       = require('checkit');
var bookshelf     = require('./index');
var plugin        = require('../models/plugin'); 

var Plugin        = new plugin();

var PluginMessage = bookshelf.Model.extend({
    initialize : function () {
        this.on('saving', this.validateSave);
    },
    
    validateSave: function () {
        var rules   = {
            message  : ["required"],
            name     : ["required"],
            plugin_id: ["integer"]
        };
        
        var checkit = new Checkit(rules);
        
        return checkit.run(this.attributes);
    },
    
    idAttribute: 'id',
    
    tableName  : "plugin_messages",
    
    plugin     : function () {
        return this.belongsTo(plugin, 'plugin_id');
    }
});

module.exports = PluginMessage;

