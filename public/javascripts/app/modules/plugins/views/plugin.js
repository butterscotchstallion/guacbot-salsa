/**
 * Plugin page view
 *
 */
define('pluginView', function (require) {
    "use strict";
    
    var Handlebars               = require('Handlebars');
    var Backbone                 =  require('Backbone');
    var $                        = require('jquery');
    var templateFile             = require('text!/javascripts/app/modules/plugins/templates/index.html');
    var template                 = Handlebars.compile(templateFile);
    var pluginModel              = require('pluginModel');
    var pluginMessageCollection  = require('pluginMessageCollection');
    var pluginMessageModel       = require('pluginMessageModel');
    var pluginMessageInfoModel   = require('pluginMessageInfoModel');
    
    var pluginView = Backbone.View.extend({
        template      : template,
        
        el: $('.plugins-container'),
        
        events: {
            'click .message-count-link': 'onMessageCountLinkClicked'
        },
        
        initialize: function () {
            var self                    = this;
            self.model                  = new pluginModel();
            self.pluginMessageInfoModel = new pluginMessageInfoModel();
            
            self.listenTo(self.model,                  'change', self.render,                  self);
            self.listenTo(self.pluginMessageInfoModel, 'change', self.renderPluginMessageInfo, self);
            
            self.model.fetch({
                reset: true,
                success: function (data, options) {
                    // hide loading message     
                },
                error: function (e) {
                    console.log(e);
                }
            }).then(function () {
                self.pluginMessageInfoModel.fetch({
                    reset: true
                });
            });
        },
        
        renderPluginMessageInfo: function (model) { 
            var messageCount = model.get('messageCount');
            var $msg         = $('.message-count');
            
            $msg.text(messageCount);

            if (messageCount === 0) {
                $('.message-count-link').addClass('disabled')
                                        .attr('data-message-count', messageCount);
            }
            
            return this;
        },
        
        render: function (model) {
            var modelJSON = model.toJSON();
            var tpl       = this.template(modelJSON);
            
            this.$el.html(tpl);

            return this;
        },
        
        onMessageCountLinkClicked: function (e) {
            var self = $(e.target);
            
            if (self.data('message-count') == 0) {
                e.preventDefault();
            }
        }
    });
    
    return pluginView;
});











