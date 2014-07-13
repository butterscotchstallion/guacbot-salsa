

define('editView', function (require) {
    "use strict";
    
    var Handlebars            = require('Handlebars');
    var Backbone              = require('Backbone');
    var $                     = require('jquery');
    var templateFile          = require('text!/javascripts/app/modules/plugin-messages/templates/edit.html');
    var template              = Handlebars.compile(templateFile);
    var pluginMessageModel    = require('pluginMessageModel');

    var pluginMessageEditView = Backbone.View.extend({
        template  : template,
        
        render    : function() {
            var modelJSON = this.model.toJSON();
            var tpl       = this.template(modelJSON);

            $(this.el).html(tpl);

            return this;
        }
    });
    
    var editView = Backbone.View.extend({
        el: $('body'),
        
        initialize: function () {
            this.model = new pluginMessageModel();
            
            this.listenTo(this.model, 'reset add change remove', this.render, this);
            
            var self = this;
            
            this.model.fetch({
                success: function (data, options) {
                    $(".loading").hide();
                }
            });
        },
        
        render: function (model) {
            var view = new pluginMessageEditView({
                model: model
            });
            
            console.log('rendering');
            
            $(".message").html(view.render().el);
        }
    });
    
    return editView;
});