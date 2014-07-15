

define('pluginMessageItemView', function (require) {
    var Backbone                  = require('Backbone');
    var $                         = require('jquery');
    var Handlebars                = require('Handlebars');
    var pluginMessageTemplateFile = require('text!/javascripts/app/modules/plugins/templates/pluginMessageRow.html');
    var pluginMessageTemplate     = Handlebars.compile(pluginMessageTemplateFile);
    
    // A single plugin message
    var pluginMessageView = Backbone.View.extend({
        tagName   : 'tr',
        
        template  : pluginMessageTemplate,
        
        initialize: function() {
        
        },
        
        render    : function() {
            var modelJSON = this.model.toJSON();
            var tpl       = this.template(modelJSON);

            $(this.el).html(tpl);

            return this;
        }
    });
    
    return pluginMessageView;
});