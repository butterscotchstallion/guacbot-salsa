

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
        pluginModel     : "app/modules/plugins/models/pluginModel",
        
        // views
        pluginView            : "app/modules/plugins/views/plugin"
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

require(["common", "jquery", "pluginView"], function (common, $, pluginView) {
    $(function () {
        new pluginView();
    });
});








