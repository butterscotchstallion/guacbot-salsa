

require.config({
    baseUrl: "/javascripts",
    
    urlArgs: "bust=" + (new Date()).getTime(),
    
    paths: {
        jquery                         : "lib/jquery.min",
        bootstrap                      : "lib/bootstrap.min",
        requireLib                     : "lib/require.min",
        Handlebars                     : "lib/handlebars",
        Backbone                       : "lib/backbone.min",
        text                           : "lib/text",
        underscore                     : "lib/underscore.min",
        jStorage                       : "lib/jstorage",
        
        // app
        common                         : "app/modules/common/main",
        pagination                     : "app/modules/common/lib/pagination",
        
        // models
        pluginModel                    : "app/modules/plugins/models/pluginModel",
        pluginMessageModel             : "app/modules/plugins/models/pluginMessageModel",
        pluginMessageInfoModel         : "app/modules/plugins/models/pluginMessageInfoModel",
        accountTokenModel              : "app/modules/accounts/models/accountTokenModel",
        accountsModel                  : "app/modules/accounts/models/accountsModel",
        
        // collections
        pluginMessageCollection        : "app/modules/plugins/collections/pluginMessageCollection",
        
        // views
        pluginView                     : "app/modules/plugins/views/plugin",
        dashboardPluginMessagesView    : "app/modules/plugins/views/dashboardPluginMessagesView",
        dashboardPluginMessagesItemView: "app/modules/plugins/views/dashboardPluginMessagesItemView",
        pluginSidebarView              : "app/modules/plugins/views/pluginSidebarView"
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
        pluginView: {
            deps: ['Backbone', 'bootstrap']
        }
    }
});

require(["common", "jquery", "pluginView", "Handlebars"], function (common, $, pluginView, Handlebars) {
    $(function () {
        new pluginView();
    });
});








