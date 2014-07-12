/**
 *
 *
 */
define('appView', function (require) {
    "use strict";
    
    var Handlebars                = require('Handlebars');
    var Backbone                  = require('Backbone');
    var $                         = require('jquery');    
    var jquerySpin                = require('jquerySpin');
    
    Handlebars.registerHelper("debug", function(optionalValue) {
        console.log("Current Context");
        console.log("====================");
        console.log(this);
        if (optionalValue) {
            console.log("Value");
            console.log("====================");
            console.log(optionalValue);
        }
    });
    
    var pluginMessageModel        = require('pluginMessageModel');
    var pluginMessageCollection   = require('pluginMessageCollection');
    var pluginMessageView         = require('pluginMessageView');
    var MessageModel              = new pluginMessageModel();
    var MessageCollection         = new pluginMessageCollection();
    
    var appView                   = Backbone.View.extend({
        el: $('#app'),
        
        initialize: function () {
            this.collection = MessageCollection;
            
            this.listenTo(this.collection, 'reset add change remove', this.render, this);
            this.listenTo(this.collection, 'change',                  this.addAll, this);
            this.listenTo(this.collection, 'add',                     this.addOne, this);
            
            var self = this;
            
            this.collection.fetch({
                success: function (data, options) {
                    $(".loading-row").hide();
                }
            });
        },
        
        addOne: function (message) {
            var view = new pluginMessageView({
                model: message
            });
            
            $("#pluginMessageTableBody").append(view.render().el);
        },
        
        addAll: function () {
            console.log('adding all, yo!');
            
            MessageCollection.each(function (message) {
                this.addOne(message);
            });
        }
    });
    
    $(function () {
        var loadingIndicator = $(".loading-indicator");
        
        loadingIndicator.spin({        
            lines: 13, // The number of lines to draw
            length: 20, // The length of each line
            width: 10, // The line thickness
            radius: 30, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#000', // #rgb or #rrggbb or array of colors
            speed: 1.8, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: true, // Whether to render a shadow
            hwaccel: true, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: '50%', // Top position relative to parent
            left: '50%' // Left position relative to parent
        }).hide();
        
        $(document).ajaxStart(function() {
            console.log('load started');
            
            //loadingIndicator.show(); 
        });
        
        $(document).ajaxComplete(function() { 
            console.log('load complete');
            
            //loadingIndicator.fadeOut('fast'); 
        });
        
        new appView(); 
    });   
    
});



