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
            "submit .search-form": function (e) {
                var self = this;
                
                self.onSearchFormSubmitted(e, self);
            },
            
            "click .clear-search-query": "onClearButtonClicked"
        },
        
        onClearButtonClicked: function () {
            $('.search-query').val("");
            
            this.getLogs();
        },
        
        onSearchFormSubmitted: function (e, self) {
            e.preventDefault();
            
            var query = $('.search-query').val().trim();
            
            var filteredCollection = self.collection.where({
                nick: query
            });
            
            self.collection.reset(filteredCollection);
        },
        
        initialize: function (options) {
            var self        = this;
            self.collection = new logCollection({
                limit: 25,
                order: "id",
                query: "http"
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
            
            if (self.collection.length > 0) {
                self.collection.each(function (log) {
                    messageWithLinks = Autolinker.link(log.get('message'), { 
                        className: "log-table-link",
                        truncate : 255
                    });
                    
                    log.set('message', messageWithLinks);
                    
                    view           = new logItemView({
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
            var html = tpl();
            
            $('.logs-container').html(html);
            $('.loading').addClass('hidden');
            
            this.renderLogs();
        }
    });

    return view;
});










