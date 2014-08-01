

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
        pluginsModel     : "app/modules/plugins/models/pluginsModel",
        
        // collections
        pluginsCollection: "app/modules/plugins/collections/pluginsCollection",
        
        // views
        pluginsMenuView    : "app/modules/common/views/pluginsMenu",
        pluginsMenuItemView: "app/modules/common/views/pluginsMenuItem"
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
        pluginsMenuView: {
            deps: ['Backbone', 'bootstrap']
        }
    }
});

require(["jquery", "pluginsMenuView"], function ($, pluginsMenuView) {
    $(function () {
        new pluginsMenuView();
        
        $(document).ajaxStart(function() {
            $('.loading-spinner').removeClass('hidden');
        });
        
        $(document).ajaxStop(function() {
            $('.loading-spinner').addClass('hidden');
        });
    });
});








