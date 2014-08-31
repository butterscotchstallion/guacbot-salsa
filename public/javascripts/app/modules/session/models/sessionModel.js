/**
 * sessionModel
 *
 */

define('sessionModel', function (require) {
    "use strict";
    
    var Backbone      = require('Backbone');

    var model         = Backbone.Model.extend({
        idAttribute: 'id',
        
        url        : "/api/v1/session",
        
        initialize : function (options) {
            
        },
        
        parse      : function (response) {
            return response.session;
        }
    });
    
    return model;
});
