/**
 * profileView
 *
 */
"use strict";

define('profileView', function (require) {
    "use strict";
    
    var Backbone        = require('Backbone');
    var profileTemplate = require('text!/javascripts/app/modules/accounts/profile/templates/profile.html');
    var profileNotFoundTemplate = require('text!/javascripts/app/modules/accounts/profile/templates/not-found.html');
    var Handlebars      = require('Handlebars');
    var jStorage        = require('jStorage');
    var moment          = require('moment');
    var accountsModel   = require('accountsModel');
    
    var view = Backbone.View.extend({
        el        : $('body'),
        
        events    : {
            
        },
        
        initialize: function (options) {
            var self = this;

            this.model = new accountsModel({
                accountID: window.app.accountID
            });
            
            this.listenTo(this.model, 'change', this.render, this);
            
            var token = $.jStorage.get('token');
            
            self.model.fetch({
                headers: {
                    "x-access-token": token
                },
                
                error: function (xhr, status, err) {
                    $('.profile-container').html(profileNotFoundTemplate);
                    $('.loading').addClass('hidden');
                }
            });
        },
        
        render: function () {
            var account = this.model.toJSON();
            var tpl     = Handlebars.compile(profileTemplate);
            var html    = tpl({
                account           : account,                
                createdAtFormatted: moment(account.created_at).fromNow(),
                updatedAtFormatted: moment(account.updated_at).fromNow()
            });
            
            $('.profile-container').html(html);
            $('.loading').addClass('hidden');
        }
    });

    return view;
});