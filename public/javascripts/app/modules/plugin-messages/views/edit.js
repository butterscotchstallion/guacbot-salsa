/**
 * Plugin message edit view
 *
 */
define('editView', function (require) {
    "use strict";
    
    var Handlebars               = require('Handlebars');
    var Backbone                 =  require('Backbone');
    var $                        = require('jquery');
    var _                        = require('underscore');
    var templateFile             = require('text!/javascripts/app/modules/plugin-messages/templates/edit.html');
    var template                 = Handlebars.compile(templateFile);
    var pluginMessageModel       = require('pluginMessageModel');
    var pluginMessageCollection  = require('pluginMessageCollection');
    var relatedMessageCollection = require('relatedMessageCollection');
    var relatedMessageItemView   = require('relatedMessageItemView');
    var relatedMessagesModel     = require('relatedMessagesModel');
    
    var MessageCollection       = new pluginMessageCollection();
    
    var pluginMessageEditView = Backbone.View.extend({
        template      : template,
        
        events        : {
            'click .recompile-button': 'onRecompileClicked',
            'input .parse-me'        : 'onRecompileClicked',
            'focus .parse-me'        : 'onFocusParseMeField',
            'input .related-messages': 'onRelatedMessageSelected'
        },
        
        onRelatedMessageSelected: function (e) {
            var self      = $(e.target);
            var messageID = self.val();
            
            window.location = "/plugin-messages/" + messageID;
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
                message: "All's well that ends well",
                originNick: "Bruce Lee",
                timeAgo: "2 days ago"
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
            
            $(this.el).html(tpl);
            
            // Render preview
            this.renderPreview({
                message: processedMessage,
                data   : stringified
            });
            
            return this;
        },
        
        processMessage: function (options) {
            var message = options.message;
            
            try {
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
                
            } catch (e) {
                console.log('errrorrrrr: ' + e);
                
                $('.parse-error-container').removeClass('hidden');
                $('.template-object-container').addClass('has-error');
                $('.message-container').addClass('has-error');
            }

            return message;            
        },
        
        compile: function (options) {
            var fmt = this.formatMessage(options.message);
            var t   = Handlebars.compile(fmt);
            
            return t(options.data);
        },
        
        formatMessage: function (m) {
            var o = m;
        
            o = this.fixUnicode(o);
            o = this.replaceUnicodeBoldWithHTMLBold(o);
            
            return o;
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
        }
    });
    
    var editView = Backbone.View.extend({
        el: $('body'),
        
        initialize: function () {
            this.model      = new pluginMessageModel();
            this.collection = new relatedMessageCollection();
            
            this.listenTo(this.model,      'reset add change remove', this.render, this);
            this.listenTo(this.collection, 'reset',                   this.addAll, this);
            this.listenTo(this.collection, 'add',                     this.addOne, this);
            
            var self = this;
            
            // Need the template to load in order to access elements present there
            this.model.fetch({
                reset  : true,
                success: function (data, options) {
                    $(".loading").hide();
                }
            }).then(function () {        
                self.collection.fetch({
                    reset  : true,
                    
                    success: function (data, options) {
                        $('.related-message-count').text(data.length);
                    }
                });
            });
        },
        
        addOne: function (message) {
            var view = new relatedMessageItemView({
                model: message
            });
            
            $(".related-messages").append(view.render().el);
        },
        
        addAll: function () {
            var self = this;
            
            this.collection.each(function (message) {
                self.addOne(message);
            });
        },
        
        render: function (model) {
            var view = new pluginMessageEditView({
                model: model
            });
            
            console.log('rendering');
            
            $(".message-container").html(view.render().el);
        }
    });
    
    return editView;
});