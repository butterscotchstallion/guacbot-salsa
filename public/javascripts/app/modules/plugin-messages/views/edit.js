/**
 * Plugin message edit view
 *
 */
define('editView', function (require) {
    "use strict";
    
    var Handlebars            = require('Handlebars');
    var Backbone              = require('Backbone');
    var $                     = require('jquery');
    var _                     = require('underscore');
    var templateFile          = require('text!/javascripts/app/modules/plugin-messages/templates/edit.html');
    var template              = Handlebars.compile(templateFile);
    var pluginMessageModel    = require('pluginMessageModel');

    var pluginMessageEditView = Backbone.View.extend({
        template      : template,
        
        events        : {
            'click .recompile-button': 'onRecompileClicked'
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
                recipient: "PrgmrBill"
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
                
            } catch (e) {
                console.log('errrorrrrr: ' + e);
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
            this.model = new pluginMessageModel();
            
            this.listenTo(this.model, 'reset add change remove', this.render, this);
            
            var self = this;
            
            this.model.fetch({
                success: function (data, options) {
                    $(".loading").hide();
                }
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