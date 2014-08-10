/**
 * pluginMessageNameCollection
 *
 */
"use strict";

define('pluginMessageNameCollection', function (require) {
    var Backbone                = require('Backbone');
    var pluginID                = parseInt(window.app.pluginID, 10);
    
    var pluginMessageNameCollection = Backbone.Collection.extend({
        url       : '/api/v1/plugins/' + pluginID + '/messages/names',
        
        comparator: "name",
        
        initialize: function (options) {
            if (options) {                
                
            }
        },
        
        parse     : function (response, options) {
            return response.names;
        }
    });

    return pluginMessageNameCollection;
    
});