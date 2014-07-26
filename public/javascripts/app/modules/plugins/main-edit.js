

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

        // collections
        pluginMessageCollection: "app/modules/plugins/collections/pluginMessageCollection",
        
        // views
        messageView            : "app/modules/plugins/views/messageView",
        relatedMessageItemView : "app/modules/plugins/views/relatedMessageItemView",
        pluginMessageHeaderView: "app/modules/plugins/views/pluginMessageHeaderView"
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
        messageView: {
            deps: ['Backbone', 'bootstrap']
        }
    }
});

require(function (require) {
    var common                  = require('common');
    var sidebarView             = require('sidebarView');
    var messageView             = require('messageView');
    var pluginMessageHeaderView = require('pluginMessageHeaderView');
    
    $(function () {
        new messageView();
        new sidebarView();
        new pluginMessageHeaderView();
    });
});








