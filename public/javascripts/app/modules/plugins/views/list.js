/**
 * main view
 *
 */
define('listView', function (require) {
    "use strict";
    
    var Handlebars                  = require('Handlebars');
    var Backbone                    = require('Backbone');
    var $                           = require('jquery');    
    var paginationTemplate          = require('text!/javascripts/app/modules/plugins/templates/messages/pagination.html');
    var pluginMessageModel          = require('pluginMessageModel');
    var pluginMessageCollection     = require('pluginMessageCollection');
    var pluginMessageNameCollection = require('pluginMessageNameCollection');
    var pluginMessageItemView       = require('pluginMessageItemView');
    var pluginMessageInfoModel      = require('pluginMessageInfoModel');
    var pagination                  = require('pagination');
    
    var listView                    = Backbone.View.extend({
        el: $('body'),
        
        initialize: function () {            
            var self        = this;
            this.name       = this.getQueryStringParameter('name');
            this.query      = this.getQueryStringParameter('query');
            this.offset     = parseInt(this.getQueryStringParameter('offset'), 10) || 0;
            this.limit      = parseInt(this.getQueryStringParameter('limit'),  10) || 10;
            this.names      = new pluginMessageNameCollection();
            this.info       = new pluginMessageInfoModel();
            this.collection = new pluginMessageCollection({
                name  : this.name,
                query : this.query,                
                offset: this.offset,
                limit : this.limit,
            });
            
            this.listenTo(this.collection, 'reset',  this.addAll,     this);
            this.listenTo(this.names,      'reset',  this.addNames,   this);
            this.listenTo(this.info,       'change', this.renderInfo, this);
            
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
            
            this.info.fetch();
        },
        
        events: {
            'click .message-link': 'onMessageModalLinkClicked',
            'click .reset-button': 'onResetButtonClicked'
        },
        
        onResetButtonClicked: function () {
            window.location = "/plugins/" + window.app.pluginID + "/messages";
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
            
            this.names.each(function (n) {
                self.addName(n);
            });
            
            var currentItem = $('.plugin-name option[value="' + this.name + '"]');
            
            currentItem.attr('selected', 'selected');
            
            $('.query').val(this.query);
        },
        
        addAll: function () {
            var self = this;
            
            self.collection.each(function (message) {
                self.addOne(message);
            });
        },
        
        renderInfo: function () {
            this.renderPagination();
        },
        
        renderPagination: function () {
            var tpl          = Handlebars.compile(paginationTemplate);
            var pages        = this.info.get('pages');
            var itemsPerPage = 10;
            var currentPage  = parseInt(this.getQueryStringParameter('page'), 10);
            var templateData = pagination.getInfo({
                pages       : pages,
                currentPage : currentPage,
                limit       : this.limit,
                offset      : this.getQueryStringParameter('offset'),
                name        : this.name,
                query       : this.query,
                itemsPerPage: itemsPerPage       
            });
            
            var html  = tpl(templateData);
            
            $('.pagination-container').html(html);
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



