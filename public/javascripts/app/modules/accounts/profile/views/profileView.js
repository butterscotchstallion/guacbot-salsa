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
    var fileupload      = require("jquery.fileupload");
    var tokenModel      = require('accountTokenModel');
    
    var view = Backbone.View.extend({
        el        : $('body'),
        
        initialize: function (options) {
            var self       = this;
            self.accountID = parseInt(window.salsa.profile.accountID, 10);
            self.token     = tokenModel;
            self.model     = new accountsModel({
                accountID: self.accountID
            });
            
            self.listenTo(self.model, 'change', self.render, self);
            
            self.model.fetch({
                headers: {
                    "x-access-token": self.token
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
            /**
             * window.salsa.profile.accountID is provided by the route
             * via template variable. This strategy saves us from having to parse
             * the accountID out of the URL on the client side.
             *
             */
            var session = $.jStorage.get('account');
            var canEdit = session.id === this.accountID;
            var html    = tpl({
                account           : account,                
                createdAtFormatted: moment(account.created_at).fromNow(),
                updatedAtFormatted: moment(account.updated_at).fromNow(),
                canEdit           : canEdit
            });
            
            console.log('can edit: ', canEdit);
            
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
                    //window.location.reload();
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










