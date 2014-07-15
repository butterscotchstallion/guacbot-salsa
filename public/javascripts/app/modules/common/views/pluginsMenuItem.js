

define('pluginsMenuItem', function (require) {
    var Backbone          = require('Backbone');
    var $                 = require('jquery');
    var Handlebars        = require('Handlebars');
    var tplFile           = require('text!/javascripts/app/modules/common/templates/pluginsMenuItem.html');
    var tpl               = Handlebars.compile(tplFile);
    var pluginsCollection = require('pluginsCollection');
    
    var view       = Backbone.View.extend({
        tagName   : 'li',
        
        className : function (el) {
            
        },
        
        template  : tpl,
        
        initialize: function() {
            this.collection = new pluginsCollection();
            
            this.listenTo(this.collection, 'reset', this.addPlugins, this);            
        },
        
        addPlugins: function () {
            var self = this;
            
            this.collection.each(function (model) {
                self.render(model);
            });
        },
        
        render    : function (model) {
            var modelJSON = model.toJSON();
            var tpl       = this.template(modelJSON);
            
            $(this.el).html(tpl);

            return this;
        }
    });
    
    return view;
});