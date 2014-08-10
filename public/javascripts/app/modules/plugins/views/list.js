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
    
    var pluginMessageModel          = require('pluginMessageModel');
    var pluginMessageCollection     = require('pluginMessageCollection');
    var pluginMessageNameCollection = require('pluginMessageNameCollection');
    var pluginMessageItemView       = require('pluginMessageItemView');

    var listView                    = Backbone.View.extend({
        el: $('body'),
        
        initialize: function () {
            var name = this.getQueryStringParameter('name');
            
            this.collection = new pluginMessageCollection({
                name: name
            });
            
            this.names      = new pluginMessageNameCollection({
                
            });
            
            //this.listenTo(this.collection, 'reset add change remove', this.render, this);
            this.listenTo(this.collection, 'reset', this.addAll, this);
            this.listenTo(this.names,      'reset', this.addNames, this);

            var self = this;
            
            this.collection.fetch({
                reset  : true,
                success: function (data, options) {
                    $(".loading-row").hide();
                    $('.message-count-msg').removeClass('hidden');
                    $('#message-count').text(data.length);
                }
            });
            
            this.names.fetch({
                reset: true
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
        
        addName: function (model) {
            var name        = model.get('name');
            var $option     = $('<option />', {
                value: name,
                text : name
            });
            
            $('.plugin-name').append($option);
        },
        
        addNames: function () {
            var self        = this;
            var currentName = this.getQueryStringParameter('name');
            
            this.names.each(function (n) {
                self.addName(n);
            });
            
            var currentItem = $('.plugin-name option[value="' + currentName + '"]');
            
            currentItem.attr('selected', 'selected');
        },
        
        addAll: function () {
            var self = this;
            
            self.collection.each(function (message) {
                self.addOne(message);
            });
        },
        
        getQueryStringParameter: function (name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
    });
    
    return listView;
});



