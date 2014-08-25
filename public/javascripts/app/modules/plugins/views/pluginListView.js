/**
 * pluginListView
 *
 */
define('pluginListView', function (require) {
    "use strict";
    
    var Handlebars                  = require('Handlebars');
    var Backbone                    = require('Backbone');
    var $                           = require('jquery');    
    //var paginationTemplate          = require('text!/javascripts/app/modules/plugins/templates/messages/pagination.html');
    var pluginModel                 = require('pluginModel');
    var pluginCollection     = require('pluginCollection');    
    var pluginListItemView     = require('pluginListItemView');    
    //var pagination                  = require('pagination');
    var accountTokenModel       = require('accountTokenModel');
    
    var view       = Backbone.View.extend({
        initialize: function () {            
            var self        = this;
            
            this.collection = new pluginCollection({
                name  : this.name,
                query : this.query,                
                offset: this.offset,
                limit : this.limit,
                order : 'enabled'
            });
            
            this.listenTo(this.collection, 'reset',  this.addPlugins, this);
            
            this.collection.fetch({
                reset  : true,
                headers: {
                    "x-access-token": accountTokenModel
                }
            });
        },
        
        addPlugin: function (plugin) {
            var view = new pluginListItemView({
                model: plugin
            });
            
            $("#plugin-list-table-body").append(view.render().el);
        },
        
        addPlugins: function () {
            var self = this;
            
            self.collection.each(function (plugin) {
                self.addPlugin(plugin);
            });
            
            $('.plugin-list-table').removeClass('hidden');
            $(".loading").addClass('hidden');
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



