

define('dashboardPluginMessagesView', function (require) {
    var Backbone                        = require('Backbone');
    var $                               = require('jquery');
    var Handlebars                      = require('Handlebars');
    var tplFile                         = require('text!/javascripts/app/modules/plugins/templates/dashboardPluginMessages.html');
    var template                        = Handlebars.compile(tplFile);
    var pluginMessageModel              = require('pluginMessageModel');
    var pluginMessageCollection         = require('pluginMessageCollection');
    var dashboardPluginMessagesItemView = require('dashboardPluginMessagesItemView');
    
    var view                            = Backbone.View.extend({
        template  : template,
        
        initialize: function() {
            var self = this;
            self.model                  = new pluginMessageModel({
                limit: 5
            });
            self.collection             = new pluginMessageCollection({
                model: pluginMessageModel
            });
            
            self.listenTo(self.collection,  'reset',  self.render, self);
            
            self.collection.fetch({
                reset: true
            });
        },
        
        renderMessages: function (messages) {
            var self = this;
            
            messages.each(function (model) {
                self.addMessage(model);
            });
        },
        
        addMessage: function (message) {
            var view = new dashboardPluginMessagesItemView({
                model: message
            });
            
            $('.dashboard-messages-table-content').append(view.render().el);
        },
        
        render    : function (messages) {  
            var tpl = this.template();
            
            $('.dashboard-messages').html(tpl);
            
            this.renderMessages(messages);
            
            return this;
        }
    });
    
    return view;
});