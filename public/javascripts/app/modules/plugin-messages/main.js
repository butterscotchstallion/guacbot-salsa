

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
        
        // models
        pluginMessageModel     : "app/modules/plugin-messages/models/pluginMessageModel",
        
        // collections
        pluginMessageCollection: "app/modules/plugin-messages/collections/pluginMessageCollection",
        
        // views
        listView               : "app/modules/plugin-messages/views/list",
        pluginMessageItemView  : "app/modules/plugin-messages/views/pluginMessageItemView"
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

require(["jquery", "listView"], function ($, listView) {
    $(function () {
        new listView();
    });
});








