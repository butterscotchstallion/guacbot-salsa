

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

        // collections
        
        // views
        addView         : "app/modules/plugins/views/add",
        pluginHeaderView: "app/modules/plugins/views/pluginHeaderView"
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

require(["common", "addView", "pluginHeaderView"], function (common, addView, pluginHeaderView) {
    $(function () {
        new addView();
        new pluginHeaderView();
    });
});








