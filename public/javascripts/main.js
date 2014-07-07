

require.config({
    baseUrl: "/javascripts",
    
    paths: {
        jquery        : "lib/jquery.min",
        bootstrap     : "lib/bootstrap.min",
        requireLib    : "lib/require.min",
        Handlebars    : "lib/handlebars",
        
        app           : "app/app",
        editor        : "app/editor/editor",
        pluginMessages: "app/plugin-messages/plugin-messages"
    },
    shim: {
        bootstrap: {
            deps: ['jquery']
        },
        Handlebars: {
            exports: 'Handlebars'
        }
    }
});

require(["app"]);