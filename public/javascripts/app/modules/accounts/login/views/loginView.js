/**
 * login view
 *
 */
define('loginView', function (require) {
    "use strict";
    
    var Backbone                 = require('Backbone');
    var loginBoxTemplate         = require('text!/javascripts/app/modules/accounts/login/templates/login-box.html');
    var Handlebars               = require('Handlebars');
    var jStorage                 = require('jStorage');
    var accountTokenModel        = require('accountTokenModel');
    
    var view = Backbone.View.extend({
        el        : $('body'),
        
        events    : {
            'submit .login-form': 'onLoginFormSubmitted'
        },
        
        onLoginFormSubmitted: function (e) {
            e.preventDefault();
            
            this.login({
                data    : {
                    name    : $('#account-name').val().trim(),
                    password: $('#account-password').val().trim()
                },
                done    : this.onSuccessfulLogin,
                fail    : this.onLoginFailure
            });
        },
        
        login: function (options) {
            var xhr = $.ajax({
                url        :  "/api/v1/session",
                type       : "POST",
                data       : JSON.stringify(options.data),
                context    : this,
                contentType: "application/json"
            });
            
            xhr.done(options.done);
            xhr.fail(options.fail);
        },
        
        onLoginFailure: function (xhr, status, err, message) {
            console.log(message);
            
            if (message) {
                $('#login-failure-message-text').text(err || message);
            }
            
            $('.login-failure-message').removeClass('hidden');
        },
        
        onSuccessfulLogin: function (data) {
            if (data.status === "OK") {
                $.jStorage.set('token', data.session.token);
                $.jStorage.set('tokenExpiration', data.session.expires_at);
                $.jStorage.set('account', data.account);
                
                window.location = "/accounts/" + data.account.guid;
            } else {
                this.onLoginFailure(null, null, null, data.message);           
            }
        },
        
        initialize: function (options) {
            this.render();
        },
        
        render: function () {            
            var tpl = Handlebars.compile(loginBoxTemplate);
            var html = tpl();
            
            $('.login-container').html(html);
            $('.loading').addClass('hidden');
        }
    });

    return view;
});