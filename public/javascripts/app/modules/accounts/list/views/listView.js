/**
 * listView
 *
 */
define('listView', function (require) {
    "use strict";
    
    var Backbone              = require('Backbone');
    var listTpl               = require('text!/javascripts/app/modules/accounts/list/templates/list.html');
    var Handlebars            = require('Handlebars');
    var accountTokenModel     = require('accountTokenModel');
    var AccountCollection     = require('accountCollection');
    var accountsTableItemView = require('accountsTableItemView');
    var timeago               = require('timeago');
    
    var view = Backbone.View.extend({
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
            
            this.renderAccountsTable();
        },
        
        renderAccountsTable: function () {
            var self = this;
            var view;
            
            self.collection.each(function (a) {
                self.renderAccountTableRow(a);
            });
            
            $('.timeago').timeago();
        },
        
        renderAccountTableRow: function (account) {
            var view = new accountsTableItemView({
                model: account
            });
            
            $('.accounts-tbody').append(view.render().el);
        }
    });
    
    return view;    
});


