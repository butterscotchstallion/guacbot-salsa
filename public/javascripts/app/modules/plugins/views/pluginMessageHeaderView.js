

define('pluginMessageHeaderView', function (require) {
    var Handlebars                           = require('Handlebars');
    var Backbone                             = require('Backbone');
    var $                                    = require('jquery');
    var _                                    = require('underscore');
    var pluginMessageHeaderTemplate          = require('text!/javascripts/app/modules/plugins/templates/messages/plugin-message-header.html');
    var pluginMessageHeaderTemplateCompiled  = Handlebars.compile(pluginMessageHeaderTemplate);
    var pluginMessageModel                   = require('pluginMessageModel');
    
    var view = Backbone.View.extend({
        el        : $('.plugin-message-header'),
        
        template  : pluginMessageHeaderTemplateCompiled,
        
        initialize: function () {
            var self        = this;
            
            self.model = new pluginMessageModel();
            
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