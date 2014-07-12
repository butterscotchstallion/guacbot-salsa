/**
 * pluginMessageCollection
 *
 */
define('pluginMessageCollection', function (require) {
    var Backbone                = require('Backbone');
    var pluginMessageModel      = require('pluginMessageModel');
    
    var pluginMessageCollection = Backbone.Collection.extend({
        url       : '/api/v1/plugin-messages',

        model     : pluginMessageModel,
        
        comparator: function (a, b) {
            return a.filename > b.filename;
        }
    });

    return pluginMessageCollection;
    
});