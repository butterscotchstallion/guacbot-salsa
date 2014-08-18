/**
 * plugin model
 *
 */
define('pluginModel', function (require) {
    "use strict";
    
    var Backbone      = require('Backbone');

    var model         = Backbone.Model.extend({
        idAttribute: 'id',
        
        urlRoot    : "/api/v1/plugins/",
        
        url        : function () {
            var url = this.urlRoot;
            
            //if (!this.isNew()) {
                url += window.app.pluginID;
            //}
            
            return url;
        },
        
        parse      : function (response, options) {
            return response.plugin;
        }
    });
    
    return model;
});
