/**
 * accountInfoView
 *
 */
define('accountInfoView', function (require) {
    "use strict";
    
    var Backbone                   = require('Backbone');
    var accountInfoTemplate        = require('text!/javascripts/app/modules/accounts/login/templates/account-info.html');
    var accountInfoPopoverTemplate = require('text!/javascripts/app/modules/accounts/login/templates/account-info-popover.html');
    var Handlebars                 = require('Handlebars');
    var jStorage                   = require('jStorage');
    var moment                     = require('moment');
    var accountsModel              = require('accountsModel');
    var accountTokenModel          = require('accountTokenModel');
    var sessionModel               = require('sessionModel');
    
    var view = Backbone.View.extend({
        el        : $('body'),
        
        events    : {
            'click .logout-link': 'onLogoutButtonClicked'
        },
        
        onLogoutButtonClicked: function (e) {
            e.preventDefault();
            
            var model = new sessionModel({
                token: $.jStorage.get('token')
            });
            
            $.jStorage.set('account', null);
            $.jStorage.set('token', null);
            
            window.location = '/session/new';
            
            /*
            var res = model.destroy({
                success: function () {
                    console.log('baleeted');
                    
                    //$.jStorage.set('account', null);
                    //$.jStorage.set('token', null);
                    
                    //window.location = '/session/new';
                },
                error: function () {
                    console.log('error');
                }
            });*/
        },
        
        initialize: function (options) {
            var self      = this;
            var acct      = $.jStorage.get('account');
            var accountID = acct ? acct.id : -1;
            
            this.model = new accountsModel({
                accountID: accountID
            });
            
            this.listenTo(this.model, 'change', this.render, this);
            
            this.model.fetch({
                headers: {
                    "x-access-token": accountTokenModel
                },
                success: function () {
                    // Overwrite account info each time so that any
                    // tampering with the local storage will be far
                    // more difficult
                    $.jStorage.set('account', self.model.toJSON());
                }
            });
        },
        
        compile: function (template, data) {
            var tpl = Handlebars.compile(template);
            
            return tpl(data);
        },
        
        render: function () {
            this.renderAccountInfo();
        },
        
        renderAccountInfo: function () {
            var account = this.model.toJSON();
            var html    = this.compile(accountInfoTemplate, {
                account: account
            });
            
            $('.account-info-container').html(html);
            
            // Popover account info
            var expires            = $.jStorage.get('tokenExpiration');
            var expirationReadable = moment(expires).fromNow();
            
            $('.account-info-label').popover({
                trigger  : 'hover',
                html     : true,
                content  : this.compile(accountInfoPopoverTemplate, {
                    account           : account,
                    expirationReadable: expirationReadable,
                    env               : window.app.env
                }),
                placement: 'bottom'
            });
        }
    });

    return view;
});