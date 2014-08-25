

define('pluginsMenuView', function (require) {
    var Backbone            = require('Backbone');
    var $                   = require('jquery');
    var Handlebars          = require('Handlebars');
    var tplFile             = require('text!/javascripts/app/modules/common/templates/pluginsMenuItem.html');
    var tpl                 = Handlebars.compile(tplFile);
    var pluginCollection    = require('pluginCollection');
    var pluginsModel        = require('pluginsModel');
    var pluginsMenuItemView = require('pluginsMenuItemView');
    var menuSearchView      = require('menuSearchView');
    var accountTokenModel  = require('accountTokenModel');
    
    var pluginsMenuView = Backbone.View.extend({
        initialize: function() {
            var self        = this;
            this.collection = new pluginCollection({
                model: pluginsModel
            });
            
            this.listenTo(this.collection, 'reset', this.addPlugins, this);
            
            this.collection.fetch({
                headers: {
                    "x-access-token": accountTokenModel
                },
                reset  : true,
                success: function () {
                    $('.plugin-count').removeClass('hidden')
                                      .text(self.collection.length);
                                     
                    $('.plugins-dropdown').removeClass('hidden');
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
            
            self.collection.each(function (message) {
                self.addPlugin(message);
            });
            
            self.render();
        },
        
        render    : function() {
            new menuSearchView({
                plugins: this.collection.toJSON()
            });
        }
    });
    
    return pluginsMenuView;
});