

define('pluginListItemView', function (require) {
    var Backbone               = require('Backbone');
    var $                      = require('jquery');
    var Handlebars             = require('Handlebars');
    var pluginItemTemplateFile = require('text!/javascripts/app/modules/plugins/templates/plugin-row.html');
    var pluginTemplate         = Handlebars.compile(pluginItemTemplateFile);
    
    var view = Backbone.View.extend({
        tagName   : 'tr',
        
        template  : pluginTemplate,
        
        initialize: function() {
        
        },
        
        render    : function() {
            var modelJSON = this.model.toJSON();
            var tpl       = this.template(modelJSON);

            this.$el.html(tpl);

            return this;
        }
    });
    
    return view;
});