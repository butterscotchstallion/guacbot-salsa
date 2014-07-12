/**
 * main view
 *
 */
define('appView', function (require) {
    "use strict";
    
    var Handlebars                = require('Handlebars');
    var Backbone                  = require('Backbone');
    var $                         = require('jquery');    

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
        el: $('body'),
        
        initialize: function () {
            this.collection = MessageCollection;
            
            this.listenTo(this.collection, 'reset add change remove', this.render, this);
            this.listenTo(this.collection, 'change',                  this.addAll, this);
            this.listenTo(this.collection, 'add',                     this.addOne, this);
            
            var self = this;
            
            this.collection.fetch({
                success: function (data, options) {
                    $(".loading-row").hide();
                    $('.message-count-msg').removeClass('hidden');
                    $('#message-count').text(data.length);
                }
            });
        },
        
        events: {
            'click .message-link': 'onMessageModalLinkClicked'
        },
        
        onMessageModalLinkClicked: function (e) {
            e.preventDefault();
            
            var self = $(e.target);
            
            $('#message-name').val(self.data('message-name'));
            $('#message').val(self.data('message'));
            $('#message-plugin').val(self.data('plugin-name'));
        },
        
        addOne: function (message) {
            var view = new pluginMessageView({
                model: message
            });
            
            $("#pluginMessageTableBody").append(view.render().el);
        },
        
        addAll: function () {
            MessageCollection.each(function (message) {
                this.addOne(message);
            });
        }
    });
    
    $(function () {        
        new appView(); 
    });   
    
});



