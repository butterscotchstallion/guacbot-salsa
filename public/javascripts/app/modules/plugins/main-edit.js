

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
        pluginMessageInfoModel : "app/modules/plugins/models/pluginMessageInfoModel",        
        accountsModel          : "app/modules/accounts/models/accountsModel",
        
        // collections
        pluginMessageCollection: "app/modules/plugins/collections/pluginMessageCollection",
        
        // views
        messageView            : "app/modules/plugins/views/messageView",
        messageEditView        : "app/modules/plugins/views/messageEditView",
        pluginMessageHeaderView: "app/modules/plugins/views/pluginMessageHeaderView",
        pluginSidebarView      : "app/modules/plugins/views/pluginSidebarView",
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

require(['common', 'messageView', 'pluginMessageModel', 'pluginMessageCollection'], function (common, messageView, pluginMessageModel, pluginMessageCollection) {
    $(function () {
        console.log('edit main');
        var messages = new pluginMessageCollection();
        
        new messageView({
            model     : new pluginMessageModel(),
            isNew     : false,
            collection: messages
        });
    });
});








