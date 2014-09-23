/**
 * logCollection
 *
 */
define('logCollection', function (require) {
    var Backbone   = require('Backbone');

    var collection = Backbone.Collection.extend({
        url        : function () {
            var earl = '/api/v1/logs/messages?a=1';
            
            if (this.order) {
                earl += '&order=' + this.order;
            }
            
            if (this.nick) {
                earl += "&nick=" + this.nick;
            }
            
            if (this.channel) {
                earl += "&channel=" + this.channel;
            }
            
            if (this.limit) {
                earl += "&limit=" + this.limit;
            }
            
            if (this.query) {
                earl += "&query=" + this.query;
            }
            
            return earl;
        },

        initialize : function (options) {
            if (options) {
                this.order   = options.order;
                this.limit   = options.limit || 25;
                this.nick    = options.nick  || "";
                this.query   = options.query || "";
                this.channel = options.channel || "";
            }
        },
        
        comparator : function (a, b) {
            return this.order || a.id < b.id;
        },
        
        parse      : function (response, options) {
            return response.messages;
        }
    });

    return collection;    
});