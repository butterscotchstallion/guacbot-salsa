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
        
        url        : "/api/v1/plugins/" + pluginID + "/messages/" + pluginMessageID,
        
        validate   : function (attrs, options) {
            console.log(attrs);
            
            try {
                var t   = Handlebars.compile(attrs.message);   
                var tpl = t();

            } catch (e) {
                return e.message;
            }
        }
    });
    
    return pluginMessage;
});
