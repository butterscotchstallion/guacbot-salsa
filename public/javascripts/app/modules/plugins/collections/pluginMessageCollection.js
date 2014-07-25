/**
 * pluginMessageCollection
 *
 */
define('pluginMessageCollection', function (require) {
    var Backbone                = require('Backbone');
    var pluginID                = parseInt(window.app.pluginID, 10);
    
    var pluginMessageCollection = Backbone.Collection.extend({
        url       : '/api/v1/plugins/' + pluginID + '/messages',
        
        comparator: "name",
        
        initialize: function (options) {
            if (options) {
                var limit = parseInt(options.limit, 10);
                
                if (limit > 0) {
                    this.url += '?limit=' + limit;
                }
            }
        },
        
        parse     : function (response, options) {
            return response.messages;
        }
    });

    return pluginMessageCollection;
    
});