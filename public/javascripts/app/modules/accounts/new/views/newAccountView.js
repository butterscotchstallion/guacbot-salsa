/**
 * newAccountView
 *
 */
"use strict";

define('newAccountView', function (require) {
    "use strict";
    
    var Backbone          = require('Backbone');
    var Handlebars        = require('Handlebars');
    var jStorage          = require('jStorage');
    var moment            = require('moment');
    var accountCollection = require('accountCollection');
    var fileupload        = require("jquery.fileupload");
    var tokenModel        = require('accountTokenModel');
    var _                 = require('underscore');
    
    var view = Backbone.View.extend({
        el        : $('body'),
        
        events    : {
            "blur .check-if-exists": "checkIfExists"
        },
        
        checkIfExists: function (e) {
            var $target = $(e.target);
            var query   = $target.val();
            var field   = $target.attr('name');
            var xhr     = $.ajax({
                url: "/api/v1/accounts?" + field + "=" + query,
                headers: {
                    "x-access-token": tokenModel
                }
            });
            
            xhr.done(function (data) {
                var accountsFound      = data.accounts || [];
                var accountUnavailable = accountsFound.length > 0;
                
                var container       = $($target.data('container'));
                var errorFeedback   = container.find('.error-feedback');
                var successFeedback = container.find('.success-feedback');
                var unavailableMsg  = container.find('.unavailable-message');
                
                /**
                 * If account search comes up with anything, the account name is in use. Show
                 * relevant feedback in both cases
                 *
                 */
                if (accountUnavailable) {
                    container.addClass('has-error has-feedback');
                    errorFeedback.removeClass('hidden');
                    unavailableMsg.removeClass('hidden');
                } else {
                    container.removeClass('has-error has-feedback');
                    unavailableMsg.addClass('hidden');
                    
                    container.addClass('has-feedback has-success');
                    successFeedback.removeClass('hidden');
                }
            });
            
            xhr.fail(function (xhr, status, err) {
                console.log('error checking account name: ', err);
            });
        },
        
        initialize: function (options) {
            var self       = this;
            
            self.collection = new accountCollection();
            
            self.listenTo(self.collection, 'reset', self.render, self);
            
            /*
            self.collection.fetch({
                headers: {
                    "x-access-token": self.token
                },
                
                error: function (xhr, status, err) {
                    $('.loading').addClass('hidden');
                }
            });
            */
            $('.loading').addClass('hidden');
        },
        
        render: function () {
            var account = this.model.toJSON();
            var tpl     = Handlebars.compile(profileTemplate);
            /**
             * window.salsa.profile.accountID is provided by the route
             * via template variable. This strategy saves us from having to parse
             * the accountID out of the URL on the client side.
             *
             */
            var canEdit = account.guid === this.guid;
            var html    = tpl({
                account           : account,                
                createdAtFormatted: moment(account.created_at).fromNow(),
                updatedAtFormatted: moment(account.updated_at).fromNow(),
                canEdit           : canEdit
            });
            
            $('.profile-container').html(html);
            $('.loading').addClass('hidden');
            
            if (canEdit) {
                this.renderEditControls();
            }
        },
        
        renderEditControls: function () {
            var onProgress = 
            $('.account-avatar-filename').fileupload({
                dataType   : 'json',
                url        : "/api/v1/accounts/avatar",
                type       : "POST",
                headers    : {
                    "x-access-token": this.token
                },
                done       : function (e, data) {
                    window.location.reload();
                },
                progressall: function (e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    
                    $('.progress').removeClass('hidden');
                    
                    $('.file-upload-progress-bar').css({
                        width: progress + '%'
                    });
                }
            });
        }
    });

    return view;
});










