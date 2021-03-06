/**
 * newAccountView
 *
 */
"use strict";

define('newAccountView', function (require) {
    "use strict";
    
    var Backbone           = require('Backbone');
    var Handlebars         = require('Handlebars');
    var jStorage           = require('jStorage');
    var moment             = require('moment');
    var accountCollection  = require('accountCollection');
    var accountsModel      = require('accountsModel');
    var fileupload         = require("jquery.fileupload");
    var tokenModel         = require('accountTokenModel');
    var _                  = require('underscore');
    var bootstrapValidator = require('bootstrapValidator');
    
    var view = Backbone.View.extend({
        el        : $('body'),
        
        events    : {
            //"blur   .check-if-exists": "checkIfExists",
            "submit #account-form"   : "onCreateAccountFormSubmitted"
        },
        
        onCreateAccountFormSubmitted: _.throttle(function (e) {
            e.preventDefault();
            
            
            
        }, 1000),
        
        checkIfExists: _.throttle(function (e) {
            return this.requestAPI(e);            
        }, 1000),
        
        requestAPI: function (e) {
            var $target = $(e.target);
            var query   = encodeURIComponent($target.val().trim());
            
            if (query.length > 0) {
                var field   = $target.attr('name');
                var xhr     = $.ajax({
                    url: "/api/v1/accounts?" + field + "=" + query,
                    headers: {
                        "x-access-token": tokenModel
                    },
                    cache: false
                });
                
                xhr.done(function (data) {
                    var accountsFound      = data.accounts || [];
                    var accountUnavailable = accountsFound.length > 0;
                    
                    var container          = $($target.data('container'));
                    var feedback           = container.find('.form-control-feedback');
                    var errorFeedback      = container.find('.error-feedback');
                    var successFeedback    = container.find('.success-feedback');
                    var unavailableMsg     = container.find('.unavailable-message');
                    var createButton       = $('.create-account-button');
                    var form               = $('#account-form');
                    
                    // Hide all feedback first
                    feedback.addClass('hidden');
                    
                    /**
                     * If account search comes up with anything, the account name is in use. Show
                     * relevant feedback in both cases
                     *
                     */
                    if (accountUnavailable) {
                        container.addClass('has-error has-feedback');
                        errorFeedback.removeClass('hidden');
                        unavailableMsg.removeClass('hidden');
                        
                        createButton.addClass('disabled').prop('disabled', true);
                    } else {
                        container.removeClass('has-error has-feedback');
                        unavailableMsg.addClass('hidden');
                        
                        container.addClass('has-feedback has-success');
                        successFeedback.removeClass('hidden');
                        
                        if (form.find('.has-error').length === 0) {
                            createButton.removeClass('disabled').prop('disabled', false);
                        }
                    }
                });
                
                xhr.fail(function (xhr, status, err) {
                    console.log('error checking account name: ', err);
                });
            }
        },
        
        initialize: function (options) {
            var self        = this;            
            self.collection = new accountCollection();
            
            self.listenTo(self.collection, 'add', self.onAccountCreated, self);
            
            $('.loading').addClass('hidden');
            
            $.ajaxSetup({
                headers: {
                    "x-access-token": tokenModel
                }
            });
            
            $('#account-form').bootstrapValidator({
                excluded: [':disabled', ':hidden', ':not(:visible)'],
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                live: 'disabled',
                submitButtons: 'button[type="submit"]',
                trigger: null,
                fields: {
                    "name": {
                        validators: {
                            notEmpty: {
                                message: "Account name length must be between 1 and 45 characters."
                            },
                            stringLength: {
                                min: 1,
                                max: 45,
                                message: 'Account name length should be between 1 and 45 characters.'
                            }
                        }
                    },
                    "email": {
                        validators: {
                            notEmpty: {
                                message: "Email address is required to activate your account."
                            },
                            
                            emailAddress: {
                                message: "This doesn't look like a valid email address."
                            },
                            
                            remote: {
                                url: "/api/v1/accounts?facets=valid",
                                message: "That email address is unavailable.",
                                type: "GET"
                            }
                        }
                    }
                }
            }) 
            .on('success.form.bv', function (e) {
                self.onNewAccountFormSubmitted(e, self);
            });
        },
        
        onAccountCreated: function (model, collection, options) {
            $('.account-created-message').removeClass('hidden');
        },
        
        onNewAccountFormSubmitted: function(e, context) {
            // Prevent form submission
            e.preventDefault();

            // Get the form instance
            var $form      = $(e.target);

            // Get the BootstrapValidator instance
            var bv         = $form.data('bootstrapValidator');
            
            // Get form data and turn it into an object 
            var serialized = $form.serializeArray();
            var payload    = {};
            
            serialized.map(function (item) {
                payload[item.name] = item.value;
            });
            
            context.collection.create(payload, {
                success: function (result) {
                    window.location = "/accounts/new/account-created";
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










