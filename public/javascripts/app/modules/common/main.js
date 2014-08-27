

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
        globalErrorHandler: "app/modules/common/views/globalErrorHandler",
        
        // models
        pluginsModel     : "app/modules/plugins/models/pluginsModel",
        accountTokenModel: "app/modules/accounts/models/accountTokenModel",
        sessionModel     : "app/modules/accounts/models/sessionModel",
        
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
    "globalErrorHandler",
    "pluginsMenuView", 
    "accountInfoView"
];

require(deps, function ($, globalErrorHandler, pluginsMenuView, accountInfoView) {
    $(function () {
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








