/**
 * Plugin page view
 *
 */
define('pluginView', function (require) {
    "use strict";
    
    var Handlebars               = require('Handlebars');
    var Backbone                 =  require('Backbone');
    var $                        = require('jquery');
    var templateFile             = require('text!/javascripts/app/modules/plugins/templates/index.html');
    var template                 = Handlebars.compile(templateFile);
    var pluginModel              = require('pluginModel');
    
    var pluginView = Backbone.View.extend({
        template      : template,
        
        el: $('.plugins-container'),
        
        initialize: function () {
            this.model = new pluginModel();
            
            this.listenTo(this.model, 'change', this.render, this);
            
            var self = this;
            
            this.model.fetch({
                reset: true,
                success: function (data, options) {
                    // hide loading message
     
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
         
        render: function (model) {
            var modelJSON = model.toJSON();
            var tpl       = this.template(modelJSON);

            this.$el.html(tpl);

            return this;
        }
    });
    
    return pluginView;
});











