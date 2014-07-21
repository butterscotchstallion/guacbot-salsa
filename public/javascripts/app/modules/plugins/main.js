

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
        
        // models
        pluginMessageModel     : "app/modules/plugins/models/pluginMessageModel",
        
        // collections
        pluginMessageCollection: "app/modules/plugins/collections/pluginMessageCollection",
        
        // views
        listView               : "app/modules/plugins/views/list",
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
        listView: {
            deps: ['Backbone', 'bootstrap']
        }
    }
});

require(["listView", "common"], function (listView) {
    $(function () {
        new listView();
    });
});







