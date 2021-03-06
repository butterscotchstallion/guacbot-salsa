

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
        
        common                 : "app/modules/common/main",
        pagination             : "app/modules/common/lib/pagination",
        
        // models
        pluginMessageModel     : "app/modules/plugins/models/pluginMessageModel",
        pluginMessageInfoModel     : "app/modules/plugins/models/pluginMessageInfoModel",
        accountsModel                  : "app/modules/accounts/models/accountsModel",
        
        // collections
        pluginMessageCollection: "app/modules/plugins/collections/pluginMessageCollection",
        pluginMessageNameCollection: "app/modules/plugins/collections/pluginMessageNameCollection",
        
        // views
        pluginMessageListView  : "app/modules/plugins/views/pluginMessageListView",
        pluginMessageItemView  : "app/modules/plugins/views/pluginMessageItemView"
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
        pluginMessageListView: {
            deps: ['Backbone', 'bootstrap']
        }
    }
});

require(["pluginMessageListView", "common"], function (pluginMessageListView) {
    $(function () {
        new pluginMessageListView();
    });
});








