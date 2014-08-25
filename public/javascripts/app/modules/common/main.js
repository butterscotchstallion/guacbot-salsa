

require.config({
    baseUrl: "/javascripts",
    
    urlArgs: "bust=" + (new Date()).getTime(),
    
    paths: {
        jquery        : "lib/jquery.min",
        bootstrap     : "lib/bootstrap.min",
        requireLib    : "lib/require.min",
        Handlebars    : "lib/handlebars",
        Backbone      : "lib/backbone.min",
        text          : "lib/text",
        underscore    : "lib/underscore.min",
        typeahead     : "lib/typeahead",
        jStorage      : "lib/jstorage",
        moment        : "lib/moment",
        
        // models
        pluginsModel     : "app/modules/plugins/models/pluginsModel",
        
        // collections
        pluginCollection: "app/modules/plugins/collections/pluginCollection",
        
        // views
        pluginsMenuView     : "app/modules/common/views/pluginsMenu",
        pluginsMenuItemView : "app/modules/common/views/pluginsMenuItem",
        menuSearchView      : "app/modules/common/views/menuSearchView",
        accountInfoView     : "app/modules/accounts/login/views/accountInfoView"
    },
    shim: {
        bootstrap: {
            deps: ['jquery']
        },
        Handlebars: {
            exports: 'Handlebars'
        },
        Backbone: {
            exports: 'Backbone',
            deps   : ['jquery', 'underscore']
        },
        underscore: {
            exports: '_'
        },
        pluginsMenuView: {
            deps: ['Backbone', 'bootstrap']
        },
        accountInfoView: {
            deps: ['Backbone']
        },
        typeahead: {
            deps: ['bootstrap']
        },
        jStorage: {
            deps: ['jquery']
        }
    }
});

require(["jquery", "pluginsMenuView", "accountInfoView", "Backbone"], function ($, pluginsMenuView, accountInfoView, Backbone) {
    $(function () {
        // Store "old" sync function
        var backboneSync = Backbone.sync
        
        // Now override
        Backbone.sync = function (method, model, options) {         
            var token = $.jStorage.get('token');
            
            if (token) {         
                console.log('sending token: ', token);
                
                options.beforeSend = function (xhr) {
                    xhr.setRequestHeader('x-access-token', token);
                };            
            }
            
            backboneSync(method, model, options);
        };
        
        new pluginsMenuView();
        new accountInfoView();
        
        $(document).ajaxStart(function() {
            $('.loading-spinner').removeClass('hidden');
        });
        
        $(document).ajaxStop(function() {
            $('.loading-spinner').addClass('hidden');
        });
        
    });
});








