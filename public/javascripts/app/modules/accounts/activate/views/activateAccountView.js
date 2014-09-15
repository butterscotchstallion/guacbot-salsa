/**
 * activateAccountView
 *
 */
"use strict";

define('activateAccountView', function (require) {
    "use strict";
    
    var Backbone           = require('Backbone');
    var Handlebars         = require('Handlebars');
    var accountCollection  = require('accountCollection');
    var accountsModel      = require('accountsModel');
    var tokenModel         = require('accountTokenModel');
    var _                  = require('underscore');
    var bootstrapValidator = require('bootstrapValidator');
    
    var view = Backbone.View.extend({
        el        : $('body'),
        
        events    : {
            
        },
        
        onActivationFormSubmitted: _.throttle(function (e, self) {
            e.preventDefault();
            
            var $form = $(e.target);
            var data  = {};
            
            $form.serializeArray().map(function (item) {
                data[item.name] = item.value;
            });
            
            console.log(data);
            
            var xhr = $.ajax({
                url        : "/api/v1/accounts/activate",
                type       : "PUT",
                dataType   : "json",
                contentType: "application/json; charset=utf-8",
                data       : JSON.stringify({
                    activationCode: data.activationCode,
                    password      : data.password
                })
            });
            
            xhr.done(function (response) {
                if (response.status === "OK") {
                    window.location = "/session/new";
                } else {
                    $('.activation-error-message').removeClass('hidden');
                }
            });
            
            xhr.fail(function () {
                $('.activation-error-message').removeClass('hidden');
            });
            
        }, 1000),
        
        initialize: function (options) {
            var self = this;            
            
            $.ajaxSetup({
                headers: {
                    "x-access-token": tokenModel
                }
            });

            $('#activate-account-form').bootstrapValidator({
                excluded: [':disabled', ':hidden', ':not(:visible)'],
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                live: 'enabled',
                submitButtons: 'button[type="submit"]',
                trigger: null,
                fields: {
                    activationCode: {
                        validators: {
                            notEmpty: {
                                message: "Please enter the activation code."
                            },
                            stringLength: {
                                min: 1,
                                max: 36,
                                message: 'That does not look like an activation code.'
                            }
                        }
                    },
                    
                    password: {
                        validators: {
                            notEmpty: {
                                message: "Please enter a password."
                            },
                            
                            stringLength: {
                                min: 10,
                                message: 'Passwords must be at least 10 characters long.'
                            },
                            
                            identical: {
                                field: 'confirmPassword',
                                message: 'Those passwords do not match.'
                            }
                        }
                    },
                    
                    confirmPassword: {
                        validators: {
                            notEmpty: {
                                message: "Please enter a password."
                            },
                            
                            stringLength: {
                                min: 10,
                                message: 'Passwords must be at least 10 characters long.'
                            },
                            
                            identical: {
                                field: 'password',
                                message: 'Those passwords do not match.'
                            }
                        }
                    }
                }
            }) 
            .on('success.form.bv', function (e) {
                self.onActivationFormSubmitted(e, self);
            });
        }
    });

    return view;
});










