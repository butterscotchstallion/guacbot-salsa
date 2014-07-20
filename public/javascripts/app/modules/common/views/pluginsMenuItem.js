

define('pluginsMenuItemView', function (require) {
    var Backbone          = require('Backbone');
    var $                 = require('jquery');
    var Handlebars        = require('Handlebars');
    var tplFile           = require('text!/javascripts/app/modules/common/templates/pluginsMenuItem.html');
    var tpl               = Handlebars.compile(tplFile);

    var view       = Backbone.View.extend({
        tagName   : 'li',

        template  : tpl,
        
        attributes: function () {
            var self = this;
            
            return {
                
            };
        },
        
        initialize: function() {
        
        },
        
        render    : function () {
            var modelJSON = this.model.toJSON();
            var tpl       = this.template(modelJSON);
            
            this.$el.html(tpl);

            return this;
        }
    });
    
    return view;
});