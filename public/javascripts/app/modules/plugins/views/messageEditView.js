/**
 * Plugin message edit view
 *
 */
define('messageEditView', function (require) {
    "use strict";
    
    var Handlebars               = require('Handlebars');
    var Backbone                 = require('Backbone');
    var $                        = require('jquery');
    var _                        = require('underscore');
    var IRCColorParser           = require('IRCColorParser');
    var editTemplate             = require('text!/javascripts/app/modules/plugins/templates/messages/edit.html');
    var editTemplateCompiled     = Handlebars.compile(editTemplate);

    var pluginMessageModel       = require('pluginMessageModel');
    var pluginMessageCollection  = require('pluginMessageCollection');
    
    function setMessageErrorState (message) {
        $('.parse-error-container').removeClass('hidden');
        $('.template-object-container').addClass('has-error');
        $('.message-container').addClass('has-error');
    };
    
    var view = Backbone.View.extend({
        el               : $('.edit-area'),
        
        template         : editTemplateCompiled,
        
        events           : {
            'click .recompile-button': 'onRecompileClicked',
            'input .parse-me'        : 'onRecompileClicked',
            'focus .parse-me'        : 'onFocusParseMeField',
            'click .save-message'    : 'onSaveMessageButtonClicked',
            'click .delete-button'   : 'onDeletePluginMessageButtonClicked',
            'click .add-button'      : 'onAddMessageButtonClicked'
        },
        
        initialize: function () {
            var self        = this;
            self.model      = new pluginMessageModel();
            
            self.listenTo(self.model, 'change remove', self.render,               self);
            self.listenTo(self.model, 'invalid',       self.setMessageErrorState, self);
            
            self.selectedMessageID = parseInt(window.app.pluginMessageID, 10);
            
            // Need the template to load in order to access elements present there
            self.model.fetch({
                reset  : true,
                success: function (data, options) {
                    $(".loading").hide();
                }
            });    
        },
        
        onAddMessageButtonClicked: function () {
            this.selectedMessageID = null;
            this.model.set('message', "<@{{nick}}> This is a new plugin message");
            this.model.url = "/api/v1/plugins/" + window.app.pluginID + "/messages";
            
            $('.plugin-message-subheader').text('New Message');
        },
        
        onDeletePluginMessageButtonClicked: function (e) {
            var btn = $(e.target);
            
            btn.button('loading');
            
            var pluginID = window.app.pluginID;
            
            this.model.destroy()
                      .then(function () {
                        btn.button('reset');
                        
                        window.location = "/plugins/" + pluginID;
                      });
        },
        
        onSaveMessageButtonClicked: function (e) {
            var self = this;
            
            self.model.set({
                message  : $('.message').val().trim(),
                plugin_id: window.app.pluginID,
                id       : self.selectedMessageID
            })
            .save({
                patch: true
            }).then(function (data) {
                if (self.model.isNew()) {
                    self.onNewMessageSavedSuccessfully(data);
                } else {
                    self.onMessageSavedSuccessfully(data);
                }
            });
        },
        
        onNewMessageSavedSuccessfully: function (data, options) {
            if (data.id) {
                window.location = "/plugins/" + window.app.pluginID + "/messages/" + data.id;
            }
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
            
            //console.log(modelJSON);
            
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
    
    return view;
});
