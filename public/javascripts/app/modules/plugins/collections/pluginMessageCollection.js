/**
 * pluginMessageCollection
 *
 */
"use strict";

define('pluginMessageCollection', function (require) {
    var Backbone                = require('Backbone');
    var pluginID                = parseInt(window.app.pluginID, 10);
    
    var pluginMessageCollection = Backbone.Collection.extend({
        urlRoot    : '/api/v1/plugins/' + pluginID + '/messages',
        
        url        : function () {
            return this.urlRoot;
        },
        
        comparator: "name",
        
        initialize: function (options) {
            if (options) {                
                var limit  = parseInt(options.limit, 10);
                var offset = parseInt(options.offset, 10);
                
                if (limit > 0) {
                    this.url += '&limit=' + limit;
                }
                
                if (offset > 0) {
                    this.url += '&offset=' + offset;
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