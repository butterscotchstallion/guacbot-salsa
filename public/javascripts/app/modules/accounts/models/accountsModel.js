/**
 * accountsModel
 *
 */

define('accountsModel', function (require) {
    "use strict";
    
    var Backbone      = require('Backbone');

    var model         = Backbone.Model.extend({
        idAttribute: 'guid',
        
        urlRoot    : "/api/v1/accounts/",
        
        initialize : function (options) {
            this.guid = options.guid;
        },
        
        url        : function () {
            var url = this.urlRoot + this.guid;
            
            return url;
        },
        
        parse      : function (response, options) {
            return response.account;
        }
    });
    
    return model;
});
