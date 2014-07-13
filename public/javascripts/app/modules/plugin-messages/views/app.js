

define('appView', function (require) {
    "use strict";
    
    var Handlebars   = require('Handlebars');
    var Backbone     = require('Backbone');
    var $            = require('jquery');
    var pluginModel  = require('pluginModel');
    
    var appView      = Backbone.View.extend({
        el: $('body'),
        
        initialize: function () {
            this.model = pluginModel;
            
            this.listenTo(this.model, 'reset add change remove', this.render, this);
            this.listenTo(this.model, 'change',                  this.add, this);
            this.listenTo(this.model, 'add',                     this.add, this);
            
            var self = this;
            
            this.model.fetch({
                success: function (data, options) {
                    $(".loading-row").hide();
                    $('.message-count-msg').removeClass('hidden');
                    $('#message-count').text(data.length);
                }
            });
        },
        
        add: function () {
            
        },
        
        render: function () {
        
        }
    });
    
    return appView;
});