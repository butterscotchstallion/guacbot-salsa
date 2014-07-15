

define('pluginsMenuView', function (require) {
    var Backbone   = require('Backbone');
    var $          = require('jquery');
    var Handlebars = require('Handlebars');
    var tplFile    = require('text!/javascripts/app/modules/plugins/templates/messages/relatedMessageItem.html');
    var tpl        = Handlebars.compile(relatedMessageTemplateFile);
    
    var pluginsMenuView = Backbone.View.extend({
        tagName   : 'li',
        
        className : function (el) {
            
        },
        
        template  : tpl,
        
        initialize: function() {
        
        },
        
        render    : function() {
            var modelJSON = this.model.toJSON();
            var tpl       = this.template(modelJSON);

            $(this.el).html(tpl);

            return this;
        }
    });
    
    return pluginsMenuView;
});