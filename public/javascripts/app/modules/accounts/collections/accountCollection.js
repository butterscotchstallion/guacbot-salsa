/**
 * accountCollection
 *
 */
define('accountCollection', function (require) {
    var Backbone     = require('Backbone');
    var accountsModel = require('accountsModel');

    var accountCollection = Backbone.Collection.extend({
        url        : function () {
            var earl = '/api/v1/accounts?a=1';
            
            if (this.order) {
                earl += '&order=' + this.order;
            }
            
            if (this.name) {
                earl += "&name=" + this.name;
            }
            
            if (this.email) {
                earl += "&email=" + this.email;
            }
            
            return earl;
        },

        initialize : function (options) {
            if (options) {
                this.order = options.order;
            }
        },
        
        comparator : function (a, b) {
            return this.order || a.created_at > b.created_at;
        },
        
        parse      : function (response, options) {
            return response.accounts;
        }
    });

    return accountCollection;    
});