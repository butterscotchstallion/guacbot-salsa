/**
 * pluginCollection
 *
 */
define('pluginCollection', function (require) {
    var Backbone     = require('Backbone');
    var pluginsModel = require('pluginsModel');

    var pluginCollection = Backbone.Collection.extend({
        url        : '/api/v1/plugins',

        comparator : function (model) {
            return model.get('filename')
        },
        
        parse      : function (response, options) {
            return response.plugins;
        }
    });

    return pluginCollection;    
});