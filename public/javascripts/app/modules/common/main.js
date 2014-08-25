

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
        
        accessController: "app/lib/accessController",
        
        // models
        pluginsModel     : "app/modules/plugins/models/pluginsModel",
        accountTokenModel: "app/modules/accounts/models/accountTokenModel",
        
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

var deps = [
    "jquery", 
    "pluginsMenuView", 
    "accountInfoView"
];

require(deps, function ($, pluginsMenuView, accountInfoView) {
    $(function () {
        $(document).ajaxError(function(event, jqxhr, settings, thrownError) {
            var statusCode = jqxhr.status;
            
            console.log('global error handler here.');
            console.log(statusCode);
            
            var isLoginPage = window.location.href.indexOf('accounts/login') !== -1;
            
            if (statusCode === 400 && !isLoginPage) {
                window.location = "/accounts/login?error=expired";
            }
        });
        
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








