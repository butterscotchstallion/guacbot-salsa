/**
 * Plugin message edit view
 *
 */
define('messageView', function (require) {
    "use strict";
    
    var Handlebars               = require('Handlebars');
    var Backbone                 = require('Backbone');
    var $                        = require('jquery');
    var _                        = require('underscore');
    var IRCColorParser           = require('IRCColorParser');
    var editTemplate             = require('text!/javascripts/app/modules/plugins/templates/messages/edit.html');
    var editTemplateCompiled     = Handlebars.compile(editTemplate);
    
    var sidebarTemplate          = require('text!/javascripts/app/modules/plugins/templates/messages/edit-sidebar.html');
    var sidebarTemplateCompiled  = Handlebars.compile(sidebarTemplate);
    
    var pluginMessageModel       = require('pluginMessageModel');
    var pluginMessageCollection  = require('pluginMessageCollection');
    var relatedMessageItemView   = require('relatedMessageItemView');

    var PluginMessageModel      = new pluginMessageModel();
    var PluginMessageCollection = new pluginMessageCollection();
    
    // Need the template to load in order to access elements present there
    PluginMessageModel.fetch({
        reset  : true,
        success: function (data, options) {
            $(".loading").hide();
        }
    });
    
    /*
    var relatedMessageView = Backbone.View.extend({
        initialize: function () {
            var self        = this;
            
            self.collection = new pluginMessageCollection({
                model: pluginMessageModel
            });
            
            self.listenTo(self.collection, 'reset', self.addMessages, self);
            
            self.collection.fetch({
                reset: true,
                success: function (data, options) {
                    $('.related-message-count').text(data.length);
                }
            });
        },
        
        addMessage: function (message) {
            var view = new relatedMessageItemView({
                model: message
            });
            
            $(".related-messages").append(view.render().el);
        },
        
        addMessages: function (messages) {
            var self = this;
            
            self.collection.each(function (message) {
                self.addMessage(message);
            });
        }
    });
    
    var sidebarView = Backbone.View.extend({
        el: $('.sidebar'),
        
        events    : {            
            'input .related-messages': 'onRelatedMessageSelected'
        },
        
        onRelatedMessageSelected: function (e) {
            var self      = $(e.target);
            var messageID = self.val();
            var pluginID  = window.app.pluginID;
            
            console.log('selected');
            
            window.location = "/plugins/" + pluginID + "/messages/" + messageID;
        },
        
        template: sidebarTemplateCompiled,
        
        initialize: function () {
            var self = this;
            
            self.render();
        },
        
        render: function (collection) {
            this.$el.html(this.template());
            
            new relatedMessageView();
        }
    });
    */
    
    return view;
});