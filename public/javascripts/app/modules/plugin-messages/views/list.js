/**
 * main view
 *
 */
define('listView', function (require) {
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
    var pluginMessageItemView     = require('pluginMessageItemView');
    
    var MessageCollection         = new pluginMessageCollection();
    
    var listView                  = Backbone.View.extend({
        el: $('body'),
        
        initialize: function () {
            this.collection = MessageCollection;
            
            //this.listenTo(this.collection, 'reset add change remove', this.render, this);
            this.listenTo(this.collection, 'reset',                   this.addAll, this);

            var self = this;
            
            this.collection.fetch({
                reset: true,
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
            var view = new pluginMessageItemView({
                model: message
            });
            
            $("#pluginMessageTableBody").append(view.render().el);
        },
        
        addAll: function () {
            var self = this;
            
            MessageCollection.each(function (message) {
                self.addOne(message);
            });
        }
    });
    
    return listView;
});



