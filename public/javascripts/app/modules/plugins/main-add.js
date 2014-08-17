

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
        pluginModel     : "app/modules/plugins/models/pluginModel",        

        pluginMessageModel : "app/modules/plugins/models/pluginMessageModel",        
        
        // collections
        pluginMessageCollection: "app/modules/plugins/collections/pluginMessageCollection",
        
        // views
        addView         : "app/modules/plugins/views/add",
        pluginHeaderView: "app/modules/plugins/views/pluginHeaderView",
        messageEditView: "app/modules/plugins/views/messageEditView"
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
        addView: {
            deps: ['Backbone', 'bootstrap']
        }
    }
});

var deps = [
    "common", 
    "messageEditView", 
    "pluginHeaderView"
];

require(deps, function (common, messageEditView, pluginHeaderView) {
    $(function () {
        
        new messageEditView({
            model: model
        });
        
        new pluginHeaderView();
    });
});








