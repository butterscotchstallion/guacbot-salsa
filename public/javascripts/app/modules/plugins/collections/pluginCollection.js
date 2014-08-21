/**
 * pluginCollection
 *
 */
define('pluginCollection', function (require) {
    var Backbone     = require('Backbone');
    var pluginsModel = require('pluginsModel');

    var pluginCollection = Backbone.Collection.extend({
        url        : function () {
            var earl = '/api/v1/plugins';
            
            if (this.order) {
                earl += '?order=' + this.order;
            }
            
            return earl;
        },

        initialize : function (options) {
            if (options) {
                this.order = options.order;
            }
        },
        
        comparator : function (model) {
            return this.order || model.get('filename')
        },
        
        parse      : function (response, options) {
            return response.plugins;
        }
    });

    return pluginCollection;    
});