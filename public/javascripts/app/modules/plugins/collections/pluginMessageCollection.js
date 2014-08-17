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
        
        url        : '/api/v1/plugins/' + pluginID + '/messages',
        
        comparator: "name",
        
        appendURLParameter: function (param) {
            var prefix = '?';
            
            if (this.url.indexOf('?') === 0) {
                prefix = '&';
            }
            
            this.url += prefix + param;
        },
        
        initialize: function (options) {
            if (options) {                
                var limit  = parseInt(options.limit,  10);
                var offset = parseInt(options.offset, 10);
                
                if (limit > 0) {
                    this.appendURLParameter('&limit='  + limit);
                }
                
                if (offset > 0) {
                    this.appendURLParameter('&offset=' + offset);
                }
                
                if (options.name) {
                    this.appendURLParameter('&name='   + options.name);
                }
                
                if (options.query) {
                    this.appendURLParameter('&query='  + options.query);
                }
            }
        },
        
        parse     : function (response, options) {
            return response.messages;
        }
    });

    return pluginMessageCollection;
    
});