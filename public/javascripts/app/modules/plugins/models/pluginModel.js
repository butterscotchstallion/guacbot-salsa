/**
 * plugin model
 *
 */
define('pluginModel', function (require) {
    "use strict";
    
    var Backbone      = require('Backbone');

    var model         = Backbone.Model.extend({
        idAttribute: 'id',
        
        url        : "/api/v1/plugins/" + window.app.pluginID,
        
        parse      : function (response, options) {
            return response.plugin;
        }
    });
    
    return model;
});