

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
        spin          : "lib/spin.min",
        jquerySpin    : "lib/jquery.spin",
        
        // models
        pluginMessageModel: "app/models/pluginMessageModel",
        
        // collections
        pluginMessageCollection: "app/collections/pluginMessageCollection",
        
        // views
        appView          : "app/views/appView", 
        pluginMessageView: "app/views/pluginMessageView", 
        
        // templates
        //pluginMessageTemplateFile: "text!app/templates/pluginMessage.html",
        
        app           : "app/app",
        editor        : "app/modules/editor",
        pluginMessages: "app/modules/plugin-messages/plugin-messages"
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
        appView: {
            deps: ['Backbone']
        },
        jquerySpin: {
            deps: ['jquery', 'spin']
        }
    }
});

require(["appView"]);








