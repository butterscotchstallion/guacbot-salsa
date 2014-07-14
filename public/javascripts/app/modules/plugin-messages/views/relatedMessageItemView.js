

define('relatedMessageItemView', function (require) {
    var Backbone                   = require('Backbone');
    var $                          = require('jquery');
    var Handlebars                 = require('Handlebars');
    var relatedMessageTemplateFile = require('text!/javascripts/app/modules/plugin-messages/templates/relatedMessageItem.html');
    var relatedMessageTemplate     = Handlebars.compile(relatedMessageTemplateFile);
    
    var relatedMessageItemView = Backbone.View.extend({
        tagName   : 'a',
        
        className : "list-group-item",
        
        attributes: {
            //href: '/plugin-messages/' + this.model.get('id')
        },
        
        template  : relatedMessageTemplate,
        
        initialize: function() {
        
        },
        
        render    : function() {
            var modelJSON = this.model.toJSON();
            var tpl       = this.template(modelJSON);
            
            $(this.el).html(tpl);

            return this;
        }
    });
    
    return relatedMessageItemView;
});