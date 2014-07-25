/**
 * plugin message model
 *
 */
define('pluginMessageModel', function (require) {
    "use strict";
    
    var Backbone        = require('Backbone');
    var pluginID        = parseInt(window.app.pluginID, 10);
    var pluginMessageID = parseInt(window.app.pluginMessageID, 10);
    var Handlebars      = require('Handlebars');
    
    var pluginMessage = Backbone.Model.extend({
        idAttribute: 'id',
        
        url        : "/api/v1/plugins/" + pluginID + "/messages",
        
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
