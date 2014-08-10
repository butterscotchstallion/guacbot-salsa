/**
 * pluginMessageCollection
 *
 */
"use strict";

define('pluginMessageCollection', function (require) {
    var Backbone                = require('Backbone');
    var pluginID                = parseInt(window.app.pluginID, 10);
    
    var pluginMessageCollection = Backbone.Collection.extend({
        url       : '/api/v1/plugins/' + pluginID + '/messages?a=1',
        
        comparator: "name",
        
        initialize: function (options) {
            if (options) {                
                var limit = parseInt(options.limit, 10);
                
                if (limit > 0) {
                    this.url += '&limit=' + limit;
                }
                
                if (options.name) {
                    this.url += '&name=' + options.name;
                }
                
                if (options.query) {
                    this.url += '&query=' + options.query;
                }
            }
        },
        
        parse     : function (response, options) {
            return response.messages;
        }
    });

    return pluginMessageCollection;
    
});