

define('dashboardPluginMessagesView', function (require) {
    var Backbone   = require('Backbone');
    var $          = require('jquery');
    var Handlebars = require('Handlebars');
    var tplFile    = require('text!/javascripts/app/modules/plugins/templates/dashboardPluginMessages.html');
    var template   = Handlebars.compile(tplFile);
    
    var view = Backbone.View.extend({
        tagName   : 'tr',
        
        template  : template,
        
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