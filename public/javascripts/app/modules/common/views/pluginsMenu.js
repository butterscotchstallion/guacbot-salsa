

define('pluginsMenuView', function (require) {
    var Backbone            = require('Backbone');
    var $                   = require('jquery');
    var Handlebars          = require('Handlebars');
    var tplFile             = require('text!/javascripts/app/modules/common/templates/pluginsMenuItem.html');
    var tpl                 = Handlebars.compile(tplFile);
    var pluginsCollection   = require('pluginsCollection');
    var pluginsModel        = require('pluginsModel');
    var pluginsMenuItemView = require('pluginsMenuItemView');
    
    var pluginsMenuView = Backbone.View.extend({
        initialize: function() {
            var self        = this;            
            this.model      = new pluginsModel();
            this.collection = new pluginsCollection({
                model: pluginsModel
            });
            
            this.listenTo(this.collection, 'reset', this.addPlugins, this);
            
            this.collection.fetch({
                reset: true,
                
                success: function () {
                    $('.plugin-count').removeClass('hidden')
                                      .text(self.collection.length);
                }
            });
        },
        
        addPlugin: function (plugin) {
            var view = new pluginsMenuItemView({
                model: plugin
            });
            
            $(".plugins-menu").append(view.render().el);
        },
        
        addPlugins: function () {
            var self = this;
            
            this.collection.each(function (message) {
                self.addPlugin(message);
            });
        },
        
        render    : function() {
            var modelJSON = this.model.toJSON();
            var tpl       = this.template(modelJSON);
        
            //$('.plugins-menu').a(tpl);

            return this;
        }
    });
    
    return pluginsMenuView;
});