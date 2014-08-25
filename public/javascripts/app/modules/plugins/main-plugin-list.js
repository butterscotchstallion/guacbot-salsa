

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
        
        // app
        common                         : "app/modules/common/main",
        
        // models
        pluginModel                    : "app/modules/plugins/models/pluginModel",
        accountTokenModel              : "app/modules/accounts/models/accountTokenModel",
        
        // collections
        pluginCollection               : "app/modules/plugins/collections/pluginCollection",
        
        // views
        pluginListView                 : "app/modules/plugins/views/pluginListView",
        pluginListItemView             : "app/modules/plugins/views/pluginListItemView"
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
        pluginListView: {
            deps: ['Backbone', 'bootstrap']
        }
    }
});

require(["common", "jquery", "pluginListView", "Handlebars"], function (common, $, pluginListView, Handlebars) {
    $(function () {
        new pluginListView();
    });
});








