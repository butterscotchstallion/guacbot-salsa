

require.config({
    baseUrl: "/javascripts",
    
    urlArgs: "bust=" + (new Date()).getTime(),
    
    paths: {
        jquery          : "lib/jquery.min",
        bootstrap       : "lib/bootstrap.min",
        requireLib      : "lib/require.min",
        Handlebars      : "lib/handlebars",
        backbone        : "lib/backbone.min",
        // Marionette uses "backbone" lowercase :|
        //backbone        : "lib/backbone.min",
        text            : "lib/text",
        underscore      : "lib/underscore.min",
        jStorage        : "lib/jstorage",
        typeahead       : "lib/typeahead",
        moment          : "lib/moment",
        common          : "app/modules/common/main",
        timeago         : "lib/timeago",
        Marionette      : "lib/marionette.min",
        Autolinker      : "lib/Autolinker.min",
        
        accountsModel      : "app/modules/accounts/models/accountsModel",
        accountTokenModel: "app/modules/accounts/models/accountTokenModel",
        
        // collections
        pluginCollection   : "app/modules/plugins/collections/pluginCollection",
        accountCollection: "app/modules/accounts/collections/accountCollection",
        logCollection: "app/modules/logs/collections/logCollection",
        
        // views
        pluginsMenuView    : "app/modules/common/views/pluginsMenu",
        pluginsMenuItemView: "app/modules/common/views/pluginsMenuItem",
        menuSearchView     : "app/modules/common/views/menuSearchView",
        indexView     : "app/modules/logs/index/views/indexView",
        sessionInfoHeaderItemView: "app/modules/session/views/sessionInfoHeaderItemView",
        logItemView: "app/modules/logs/index/views/logItemView"
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
        },
        indexView: {
            deps: ['backbone']
        },
        Marionette: {
            exports : 'Backbone.Marionette',
            deps : ['backbone']
        }
    }
});

require(["jquery", "common", "indexView"], function ($, common, indexView) {
    $(function () {
        new indexView();
    });
});








