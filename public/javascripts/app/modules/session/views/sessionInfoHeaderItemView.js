/**
 * sessionInfoHeaderItemView
 *
 */
define('sessionInfoHeaderItemView', function (require) {
    "use strict";
    
    var Backbone                   = require('Backbone');
    var accountInfoTemplate        = require('text!/javascripts/app/modules/session/templates/account-info.html');
    var accountInfoPopoverTemplate = require('text!/javascripts/app/modules/session/templates/account-info-popover.html');
    var Handlebars                 = require('Handlebars');
    var jStorage                   = require('jStorage');
    var moment                     = require('moment');
    var accountsModel              = require('accountsModel');
    var accountTokenModel          = require('accountTokenModel');
    var sessionModel               = require('sessionModel');
    var timeago                    = require('timeago');
    
    var view = Backbone.View.extend({
        el        : $('body'),
        
        events    : {
            'click .logout-link': 'onLogoutButtonClicked'
        },
        
        onLogoutButtonClicked: function (e) {
            e.preventDefault();
            
            this.model.destroy({
                headers: {
                    "x-access-token": accountTokenModel
                },
                
                success: function () {
                    $.jStorage.set('account', null);
                    $.jStorage.set('token', null);
                    
                    window.location = '/session/new';
                }
            });         
        },
        
        initialize: function (options) {
            var self = this;
            
            if (accountTokenModel) {
                this.model = new sessionModel();
                
                this.listenTo(this.model, 'change', this.render, this);
                
                this.model.fetch({
                    headers: {
                        "x-access-token": accountTokenModel
                    },
                    success: function (account) {
                        // Overwrite account info each time so that any
                        // tampering with the local storage will be far
                        // more difficult
                        $.jStorage.set('account', account);
                    }
                });
            }
        },
        
        getSessionAccount: function () {
            return this.model.get('account');
        },
        
        compile: function (template, data) {
            var tpl = Handlebars.compile(template);
            
            return tpl(data);
        },
        
        render: function () {
            this.renderAccountInfo();
        },
        
        renderAccountInfo: function () {
            var account = this.getSessionAccount();
            var html    = this.compile(accountInfoTemplate, {
                account: account
            });
            
            $('.account-info-container').html(html);
            
            // Popover account info
            var expires          = $.jStorage.get('tokenExpiration');            
            var expiresFormatted = moment(expires).fromNow();
            
            $('.account-info-label').popover({
                trigger  : 'hover',
                html     : true,
                content  : this.compile(accountInfoPopoverTemplate, {
                    account : account,
                    expires : expiresFormatted,
                    env     : window.app.env
                }),
                placement: 'bottom'
            });
        }
    });

    return view;
});