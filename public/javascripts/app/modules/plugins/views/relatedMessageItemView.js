

define('relatedMessageItemView', function (require) {
    var Backbone                   = require('Backbone');
    var $                          = require('jquery');
    var Handlebars                 = require('Handlebars');
    var relatedMessageTemplateFile = require('text!/javascripts/app/modules/plugins/templates/messages/relatedMessageItem.html');
    var relatedMessageTemplate     = Handlebars.compile(relatedMessageTemplateFile);
    
    var relatedMessageItemView = Backbone.View.extend({
        tagName   : 'option',
        
        className : function (el) {
            var currentItem = window.app.pluginMessageID;
            var classes     = [];
            
            if (this.model.get('id') == currentItem) {
                classes.push('active');
            }
            
            return classes.join(' ');
        },
        
        attributes: function () {
            var self  = this;
            
            var id    = self.model.get('id');
            var attrs = {
                value: function () {
                    return id;
                },
                title: function () {
                    return self.model.get('message');
                }
            };
            
            if (id == window.app.pluginMessageID) {
                attrs['selected'] = "selected";
            }
            
            return attrs;
        },
        
        template  : relatedMessageTemplate,
        
        initialize: function() {
        
        },
        
        render    : function() {
            var modelJSON = this.model.toJSON();
            var tpl       = this.template(modelJSON);

            this.$el.html(tpl);

            return this;
        }
    });
    
    return relatedMessageItemView;
});