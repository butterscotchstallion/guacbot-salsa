/**
 * plugin message model
 *
 */
define('pluginMessageModel', function (require) {
    "use strict";
    
    var Backbone        = require('Backbone');
    var pluginID        = parseInt(window.app.pluginID,        10);
    var pluginMessageID = parseInt(window.app.pluginMessageID, 10);
    var Handlebars      = require('Handlebars');
    
    var pluginMessage   = Backbone.Model.extend({
        idAttribute: 'id',
        
        url          : "/api/v1/plugins/" + pluginID + "/messages/" + pluginMessageID,
        
        urlRoot      : "/api/v1/plugins/" + pluginID + "/messages/",
        
        hasTimestamps: ['created_at'],
        
        validate   : function (attrs, options) {
            /**
             * User should not be able to save a plugin message that
             * cannot be successfully compiled by Handlebars
             *
             */
            try {
                var t   = Handlebars.compile(attrs.message);   
                
                t();
                
            } catch (e) {
                return e.message;
            }
        },
        
        parse: function (response, options) {
            return response.pluginMessage;
        }
    });
    
    return pluginMessage;
});
