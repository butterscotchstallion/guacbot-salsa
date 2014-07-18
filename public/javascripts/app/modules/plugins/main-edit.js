

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
        IRCColorParser: "lib/IRCColorParser",
        
        common        : "app/modules/common/main",
        
        // models
        pluginMessageModel     : "app/modules/plugins/models/pluginMessageModel",        
        relatedMessagesModel   : "app/modules/plugins/models/relatedMessagesModel",
        
        // collections
        relatedMessageCollection: "app/modules/plugins/collections/relatedMessageCollection",
        pluginMessageCollection: "app/modules/plugins/collections/pluginMessageCollection",
        
        // views
        editView               : "app/modules/plugins/views/edit",
        relatedMessageItemView : "app/modules/plugins/views/relatedMessageItemView"
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

require(["editView", "common"], function (editView, common) {
    $(function () {
        var views = editView;
        
        new views.editView();
        new views.sidebarView();
        new views.pluginMessageHeaderView();
    });
});








