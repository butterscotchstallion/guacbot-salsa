

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
        
        initialize: function (options) {
            var self   = this;
            
            self.model = options ? options.model : new pluginMessageModel();
            
            self.listenTo(self.model, 'change', self.render, self);
            
            if (!options) {
                self.model.fetch();
            } else {
                this.render();
            }
        },
        
        render    : function () {
            var tpl = this.template(this.model.toJSON());
            
            this.$el.html(tpl);
        }
    });    
    
    return view;
    
});