/**
 * listView
 *
 */
define('listView', function (require) {
    "use strict";
    
    var Backbone                 = require('Backbone');
    var loginBoxTemplate         = require('text!/javascripts/app/modules/accounts/login/templates/login-box.html');
    var Handlebars               = require('Handlebars');
    //var jStorage                 = require('jStorage');
    var accountTokenModel        = require('accountTokenModel');
    var AccountCollection       = require('accountCollection');
    
    var view = Backbone.View.extend({
        el        : $('body'),
        
        initialize: function () {
            this.collection = new AccountCollection();
            
            this.listenTo(this.collection, 'reset', this.render, this);
            
            this.collection.fetch({
                reset  : true,
                
                headers: {
                    "x-access-token": accountTokenModel
                }
            });
        },
        
        render: function () {
            var tpl = Handlebars.compile(listTpl);
            var html = tpl({
                accounts: this.collection.toJSON()
            });
            
            $('.list-container').html(html);
            $('.loading').addClass('hidden');
        }
    });
    
    
    return view;
    
});