

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
        relatedMessagesModel   : "app/modules/plugin-messages/models/relatedMessagesModel",
        
        // collections
        relatedMessageCollection: "app/modules/plugin-messages/collections/relatedMessageCollection",
        pluginMessageCollection: "app/modules/plugin-messages/collections/pluginMessageCollection",
        
        // views
        editView               : "app/modules/plugin-messages/views/edit",
        relatedMessageItemView : "app/modules/plugin-messages/views/relatedMessageItemView"
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
        editView: {
            deps: ['Backbone', 'bootstrap']
        }
    }
});

require(["jquery", "editView"], function ($, editView) {
    $(function () {
        new editView();
    });
});








