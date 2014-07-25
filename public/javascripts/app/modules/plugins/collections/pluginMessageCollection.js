/**
 * pluginMessageCollection
 *
 */
define('pluginMessageCollection', function (require) {
    var Backbone                = require('Backbone');
    var pluginID                = window.app.pluginID;
    
    var pluginMessageCollection = Backbone.Collection.extend({
        url       : '/api/v1/plugins/' + pluginID + '/messages/',
        
        comparator: "name",
        
        initialize: function (options) {
            if (options && options.limit) {
                this.url += '?limit=' + options.limit;
            }
        },
        
        parse     : function (response, options) {
            return response.messages;
        }
    });

    return pluginMessageCollection;
    
});