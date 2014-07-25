

define('pluginHeaderView', function (require) {
    var Handlebars                           = require('Handlebars');
    var Backbone                             = require('Backbone');
    var $                                    = require('jquery');
    var _                                    = require('underscore');
    var pluginHeaderTemplate          = require('text!/javascripts/app/modules/plugins/templates/messages/plugin-header.html');
    var pluginHeaderTemplateCompiled  = Handlebars.compile(pluginHeaderTemplate);
    var pluginModel                   = require('pluginModel');
    
    var view = Backbone.View.extend({
        el        : $('.plugin-header-container'),
        
        template  : pluginHeaderTemplateCompiled,
        
        initialize: function () {
            var self        = this;
            
            self.model = new pluginModel();
            
            self.listenTo(self.model, 'change add', self.render, self);
            
            self.model.fetch();
        },
        
        render    : function (model) {
            var tpl       = this.template(model.toJSON());
            
            console.log(this.$el.length);
            
            this.$el.html(tpl);
        }
    });    
    
    return view;
    
});