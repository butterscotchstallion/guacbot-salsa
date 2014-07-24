/**
 * plugin message model
 *
 */
define('pluginMessageModel', function (require) {
    "use strict";
    
    var Backbone        = require('Backbone');
    var pluginID        = window.app.pluginID;
    var pluginMessageID = window.app.pluginMessageID;
    var Handlebars      = require('Handlebars');
    
    var pluginMessage = Backbone.Model.extend({
        idAttribute: 'id',
        
        url        : function () {
            var limit = "";
            var url   = [
                "/api/v1/plugins/",
                pluginID,
                "messages",
                pluginMessageID,
                limit
            ].join('/');
            
            return url;
        },
        
        validate   : function (attrs, options) {
            try {
                var t   = Handlebars.compile(attrs.message);   
                var tpl = t();

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
