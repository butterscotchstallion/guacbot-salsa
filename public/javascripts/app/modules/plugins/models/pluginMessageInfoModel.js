/**
 * plugin message info model
 *
 */
define('pluginMessageInfoModel', function (require) {
    "use strict";
    
    var Backbone      = require('Backbone');
    var pluginID      = window.app.pluginID;
    
    var model         = Backbone.Model.extend({
        idAttribute: 'id',
        
        url        : "/api/v1/plugins/" + pluginID + "/messages/info",
        
        parse      : function (response, options) {
            return response.info;
        }
    });
    
    return model;
});
