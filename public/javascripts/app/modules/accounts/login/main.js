

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
        jStorage      : "lib/jstorage",
        typeahead     : "lib/typeahead",
        moment        : "lib/moment",
        
        common        : "app/modules/common/main",
         
        pluginsModel     : "app/modules/plugins/models/pluginsModel",
        accountsModel     : "app/modules/accounts/models/accountsModel",
        accountTokenModel: "app/modules/accounts/models/accountTokenModel",
        
        // collections
        pluginCollection: "app/modules/plugins/collections/pluginCollection",
        
        // views
        pluginsMenuView    : "app/modules/common/views/pluginsMenu",
        pluginsMenuItemView: "app/modules/common/views/pluginsMenuItem",
        menuSearchView     : "app/modules/common/views/menuSearchView",
        loginView          : "app/modules/accounts/login/views/loginView",
        sessionInfoHeaderItemView: "app/modules/session/views/sessionInfoHeaderItemView"
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
        jStorage: {
            deps: ['jquery']
        }
    }
});

require(["jquery", "common", "loginView"], function ($, common, loginView) {
    $(function () {
        new loginView();
    });
});








