

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
        pluginMessageInfoModel : "app/modules/plugins/models/pluginMessageInfoModel",
        
        // collections
        pluginMessageCollection: "app/modules/plugins/collections/pluginMessageCollection",
        
        // views
        addView         : "app/modules/plugins/views/add",
        pluginHeaderView: "app/modules/plugins/views/pluginHeaderView",
        messageEditView : "app/modules/plugins/views/messageEditView",
        messageView     : "app/modules/plugins/views/messageView",
        pluginMessageHeaderView: "app/modules/plugins/views/pluginMessageHeaderView",
        pluginSidebarView      : "app/modules/plugins/views/pluginSidebarView"
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
        },
        messageView: {
            deps: ['Backbone', 'bootstrap']
        }
    }
});

var deps = [
    "common", 
    "messageView",
    "pluginMessageCollection"
];

require(deps, function (common, messageView, pluginMessageCollection) {
    $(function () {
        
        var view = Backbone.View.extend({
            initialize: function () {
                var self        = this;
                self.collection = new pluginMessageCollection();
                
                self.listenTo(self.collection, 'add', self.renderNewMessage, self);
                
                self.collection.add({
                    name   : "ok",
                    message: "hello, world!"
                });        
            },
            
            renderNewMessage: function (model, collection, options) {
                new messageView({
                    isNew: true,
                    model: model,
                    collection: this.collection
                });
            }
        });
        
        new view();        
    });
});








