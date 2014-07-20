/**
 * Plugin message edit view
 *
 */
define('editView', function (require) {
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
    
    var pluginMessageHeaderTemplate          = require('text!/javascripts/app/modules/plugins/templates/messages/plugin-message-header.html');
    var pluginMessageHeaderTemplateCompiled  = Handlebars.compile(pluginMessageHeaderTemplate);
    
    var pluginMessageModel       = require('pluginMessageModel');
    var pluginMessageCollection  = require('pluginMessageCollection');
    var relatedMessageItemView   = require('relatedMessageItemView');

    function setMessageErrorState (message) {
        $('.parse-error-container').removeClass('hidden');
        $('.template-object-container').addClass('has-error');
        $('.message-container').addClass('has-error');
    };
    
    var PluginMessageModel      = new pluginMessageModel();
    var PluginMessageCollection = new pluginMessageCollection();
    
    // Need the template to load in order to access elements present there
    PluginMessageModel.fetch({
        reset  : true,
        success: function (data, options) {
            $(".loading").hide();
        }
    });
    
    // Container view for the whole page
    var editView = Backbone.View.extend({
        el            : $('.edit-area'),
        
        template      : editTemplateCompiled,
        
        events        : {
            'click .recompile-button': 'onRecompileClicked',
            'input .parse-me'        : 'onRecompileClicked',
            'focus .parse-me'        : 'onFocusParseMeField',
            'click .save-message'    : 'onSaveMessageButtonClicked',
            'click .delete-button'   : 'onDeletePluginMessageButtonClicked',
        },
        
        initialize: function () {
            var self        = this;
            self.model      = PluginMessageModel;
            
            self.listenTo(self.model,      'change remove', self.render, self);
            self.listenTo(self.model,      'invalid',       self.setMessageErrorState, self);
        },
        
        onDeletePluginMessageButtonClicked: function (e) {
            var btn = $(e.target);
            
            btn.button('loading');
            
            PluginMessageModel.destroy()
                      .then(function () {
                        console.log('baleeeeted');
                        btn.button('reset');
                      });
        },
        
        onSaveMessageButtonClicked: function (e) {
            var self = this;
            
            self.model.set({
                message  : $('.message').val().trim(),
                plugin_id: window.app.pluginID,
                id       : window.app.pluginMessageID
            })
            .save({
                success: self.onMessageSavedSuccessfully,
                fail   : self.onMessageSavedFailure
            }).then(function () {
                
            });
        },
        
        onMessageSavedSuccessfully: function () {
            console.log('save success');
            
            $('.save-successful-msg').removeClass('hidden');
        },
        
        onMessageSavedFailure: function (e) {
            console.log('onMessageSavedFailure');
            
            $('.save-failure-msg').removeClass('hidden');
        },
        
        onFocusParseMeField: function () {
            this.resetErrorState();
        },
        
        resetErrorState: function () {
            var parseMe = $('.parse-me');
            var container;
            
            $.each(parseMe, function () {
                container = $(this).data('container');
                
                $(container).removeClass('has-error');
            });
            
            $('.parse-error-container').addClass('hidden');
        },
        
        onRecompileClicked: function () {
            var $tplObj          = $('.template-object');
            var tplVal           = $tplObj.val();
            var msgVal           = $('.message').val();
            
            var processedMessage = this.processMessage({
                message       : msgVal,
                templateObject: tplVal
            });
            
            $('.message-preview').html(processedMessage);
        },
        
        render        : function () {
            // Render main template
            var modelJSON        = this.model.toJSON();
            var templateObject   = {
                recipient: "PrgmrBill",
                nick: "Cayenne",
                message: "Biggie Smalls is da illest",
                originNick: "Bruce Lee",
                timeAgo: "2 days ago",
                line : 1                
            };
            var stringified      = JSON.stringify(templateObject, null, 4);
            var processedMessage = this.processMessage({
                message       : modelJSON.message,
                templateObject: stringified
            });
            
            var tpl            = this.template(_.extend({
                templateObject : stringified,
                compiledMessage: processedMessage
            }, modelJSON));
            
            this.$el.html(tpl);
            
            // Render preview
            this.renderPreview({
                message: processedMessage,
                data   : stringified
            });
            
            return this;
        },
        
        processMessage: function (options) {
            var message = options.message;            
            var payload = this.tidyPayload(options.message);
            var rawData = $.trim(options.templateObject);
            var data;
            
            if (rawData.length > 0) {
                data = JSON && JSON.parse(rawData) || $.parseJSON(rawData);
            }
            
            var message = this.compile({
                message: payload,
                data   : data
            });
            
            this.resetErrorState();
            
            return message;            
        },
        
        compile: function (options) {
            var output = options.message;
            
            try {
                var fmt = this.formatMessage(options.message);
                var t   = Handlebars.compile(fmt);
                
                output = t(options.data);
                
            } catch (e) {
                //output = e.message;
                //output = false;
                setMessageErrorState(e.message);
            }
            
            return output;
        },
        
        formatMessage: function (m) {
            var o = m;
        
            o = this.fixUnicode(o);
            //o = this.replaceUnicodeBoldWithHTMLBold(o);
            o = this.parseIRCControlCodes(o);
            
            return o;
        },
        
        parseIRCControlCodes: function (input) {
            return IRCColorParser.parse({
                input: input
            });
        },
        
        fixUnicode:  function (input) {
            return input.replace(
                  /\\u([0-9a-f]{4})/g, 
                  function (whole, group1) {
                      return String.fromCharCode(parseInt(group1, 16));
                  }
            );
        },
    
        replaceUnicodeBoldWithHTMLBold: function (input) {
            return input.replace(/\u0002(.*?)\u0002/g, "<span class=\"irc-bold\">$1</span>");
        },
        
        replaceUnicodeColorWithHTMLColors: function (input) {
            return input.replace(/\u0002(.*?)\u0002/g, "<span class=\"color-$1\">$1</span>");
        },
        
        tidyPayload: function (p) {
            var o = p;
            
            if (o && typeof o === 'string') {
                o = $.trim(p);
            }
            
            return o;
        },
    
        renderPreview: function (options) {
            var template = this.compile(options);
            
            $('.message-preview').html(template);
        },
        
        setMessageErrorState: function (model, error) {
            setMessageErrorState(error);
        }
    });
    
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
    
    var pluginMessageHeaderView = Backbone.View.extend({
        template: pluginMessageHeaderTemplateCompiled,
        
        initialize: function () {
            var self        = this;
            
            self.model = PluginMessageModel;
            
            self.listenTo(self.model, 'change add', self.render, self);
        },
        
        render: function (model) {
            var tpl       = this.template(model.toJSON());
            
            $('.plugin-message-header').html(tpl);
        }
    });    
    
    return {
        editView               : editView,
        sidebarView            : sidebarView,
        pluginMessageHeaderView: pluginMessageHeaderView
    };
});