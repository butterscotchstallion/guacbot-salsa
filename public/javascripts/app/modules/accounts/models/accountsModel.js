/**
 * accountsModel
 *
 */

define('accountsModel', function (require) {
    "use strict";
    
    var Backbone      = require('Backbone');

    var model         = Backbone.Model.extend({
        idAttribute: 'id',
        
        urlRoot    : "/api/v1/accounts/",
        
        initialize : function (options) {
            this.accountID = options.accountID;
        },
        
        url        : function () {
            var url = this.urlRoot + this.accountID;
            
            return url;
        },
        
        parse      : function (response, options) {
            return response.account;
        }
    });
    
    return model;
});
