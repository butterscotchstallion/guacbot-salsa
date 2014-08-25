/**
 * Plugin page view
 *
 */
define('pluginView', function (require) {
    "use strict";
    
    var Handlebars                  = require('Handlebars');
    var Backbone                    =  require('Backbone');
    var $                           = require('jquery');
    var _                           = require('underscore');
    var templateFile                = require('text!/javascripts/app/modules/plugins/templates/index.html');
    var template                    = Handlebars.compile(templateFile);
    var pluginModel                 = require('pluginModel');    
    var pluginMessageModel          = require('pluginMessageModel');
    var pluginMessageInfoModel      = require('pluginMessageInfoModel');
    var dashboardPluginMessagesView = require('dashboardPluginMessagesView');
    var pluginSidebarView           = require('pluginSidebarView');
    
    var pluginView                  = Backbone.View.extend({
        template  : template,
        
        el        : $('.plugins-container'),
        
        events    : {
            'click .message-count-link'  : 'onMessageCountLinkClicked',
            'click .save-status'         : 'onSaveStatusButtonClicked',
            'click .delete-plugin-button': 'onDeleteButtonClicked'
        },
        
        initialize: function () {
            var self                    = this;
            self.model                  = new pluginModel();
            self.pluginMessageInfoModel = new pluginMessageInfoModel();
            
            self.listenTo(self.model,                  'change', self.renderAll,               self);
            self.listenTo(self.pluginMessageInfoModel, 'change', self.renderPluginMessageInfo, self);
            
            self.model
                .fetch();
             
            self.pluginMessageInfoModel.fetch({
                reset: true
            });
        },
        
        onDeleteButtonClicked: function (e) {
            var button  = $(e.target);
            
            button.button('loading');
            
            this.model.destroy()
                .then(function (model) {
                    button.button('reset');
                });
        },
        
        onSaveStatusButtonClicked: function (e) {
            var enabled = $('#plugin-status-enabled').is(':checked') ? 1 : 0;
            var button  = $(e.target);
            var self    = this;
            
            button.button('loading');
            
            self.model.set({
                enabled: enabled
            })
            .save()
            .then(function (model) {
                button.button('reset');
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
        
        renderAll: function (model) {
            var modelJSON = model.toJSON();    
            var disabled  = !model.get('enabled');
            var enabled   = model.get('enabled');
            var data      = _.extend({
                isDisabled: disabled,
                isEnabled : enabled
            }, modelJSON);
            var tpl       = this.template(data);
            
            this.$el.html(tpl);
            
            /**
             * Attempting to use the above variables "isDisabled" and
             * "isDisabled" result in a Handlebars parse error. Cause
             * of said parse error is undetermined at this point. The
             * below code is a workaround.
             *
             */
            if (enabled) {
                $('#plugin-status-enabled').attr('checked', true);
            } else {
                $('#plugin-status-disabled').attr('checked', true);
            }
            
            new dashboardPluginMessagesView();  
            new pluginSidebarView();
            
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











