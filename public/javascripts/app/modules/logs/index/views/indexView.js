/**
 * indexView
 *
 */
"use strict";

define('indexView', function (require) {
    "use strict";
    
    var Backbone          = require('Backbone');
    var Handlebars        = require('Handlebars');
    var indexTemplate     = require('text!app/modules/logs/index/templates/index.html');
    var accountTokenModel = require('accountTokenModel');
    var logCollection     = require('logCollection');
    var logItemView       = require('logItemView');
    var timeago           = require('timeago');
    var Autolinker        = require('Autolinker');
    
    var view              = Backbone.View.extend({
        el        : $('body'),
        
        events    : {
            "click .clear-search-query": "onClearButtonClicked"
        },
        
        onClearButtonClicked: function () {
            $('.search-query').val("");
            $('.search-form').trigger('submit');
        },
        
        initialize: function (options) {
            var self        = this;
            self.query      = self.getQueryStringParameter('query');
            self.collection = new logCollection({
                limit  : 25,
                order  : "id",
                query  : self.query,
                channel: self.getQueryStringParameter('channel'),
                nick   : self.getQueryStringParameter('nick')
            });
            
            self.listenTo(self.collection, "reset", self.render, self);
            
            self.getLogs();
        },
        
        getLogs: function () {
            this.collection.fetch({
                reset  : true,
                
                headers: {
                    "x-access-token": accountTokenModel
                }
            });
        },
        
        renderLogs: function () {
            var self = this;
            var view;
            var messageWithLinks;
            var regex;
            var message;
            
            if (self.collection.length > 0) {
                self.collection.each(function (log) {
                    message = log.get('message');
                    
                    messageWithLinks = Autolinker.link(message, { 
                        className: "log-table-link",
                        truncate : 75
                    });
                    
                    // Don't highlight words in URLs because it messes up the auto linking
                    if (self.query && message.indexOf("http") === -1) {
                        regex            = new RegExp(self.query, "gi");
                        messageWithLinks = messageWithLinks.replace(regex, function (input) {
                            return '<strong class="search-query-highlight">' + input + '</strong>';
                        });
                    }
                    
                    log.set('message', messageWithLinks);
                    
                    view = new logItemView({
                        model: log
                    });
                    
                    $('.logs-tbody').append(view.render().el);
                });
                
                $('.no-results-message').addClass('hidden');
            } else {
                $('.no-results-message').removeClass('hidden');
                $('.logs-table-container').addClass('hidden');
            }
        },
        
        render: function () {
            var tpl  = Handlebars.compile(indexTemplate);
            var html = tpl({
                query: this.query
            });
            
            $('.logs-container').html(html);
            $('.loading').addClass('hidden');
            
            this.renderLogs();
        },
        
        getQueryStringParameter: function (name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
    });

    return view;
});










