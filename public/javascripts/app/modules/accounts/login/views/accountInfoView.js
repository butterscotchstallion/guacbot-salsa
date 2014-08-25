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
    
    var view = Backbone.View.extend({
        initialize: function (options) {
            this.render();
        },
        
        compile: function (template, data) {
            var tpl = Handlebars.compile(template);
            
            return tpl(data);
        },
        
        render: function () {
            this.renderAccountInfo();
        },
        
        renderAccountInfo: function () {            
            var account = $.jStorage.get('account');            
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