/**
 * accountCollection
 *
 */
define('accountCollection', function (require) {
    var Backbone     = require('Backbone');
    var accountsModel = require('accountsModel');

    var accountCollection = Backbone.Collection.extend({
        url        : function () {
            var earl = '/api/v1/accounts';
            
            if (this.order) {
                earl += '?order=' + this.order;
            }
            
            return earl;
        },

        initialize : function (options) {
            if (options) {
                this.order = options.order;
            }
        },
        
        comparator : function (model) {
            return this.order || model.get('name')
        },
        
        parse      : function (response, options) {
            return response.accounts;
        }
    });

    return accountCollection;    
});