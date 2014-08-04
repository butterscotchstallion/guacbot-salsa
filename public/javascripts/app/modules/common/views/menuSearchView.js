/**
 * menuSearchView
 *
 */
"use strict";

define('menuSearchView', function (require) {
    var Backbone  = require('Backbone');
    var $         = require('jquery');
    var _         = require('underscore');
    var typeahead = require('typeahead');
    
    var view = Backbone.View.extend({
        map       : {},
        
        initialize: function (options) {
            var plugins = options.plugins;

            this.render(plugins);
        },
        
        render    : function(plugins) {
            var selector = $('.menu-autocomplete');
            var self     = this;
            
            selector.typeahead({
                source    : function (query, process) {
                    self.getSource({
                        query  : query,
                        process: process,
                        data   : plugins
                    });
                },
                
                updater: function (filename) {
                    var mapItem = self.map[filename];
                    
                    $('#typeahead-map-plugin-id').val(mapItem.id);
                    
                    return filename;
                },
                
                displayKey     : 'name',
                hint           : true,
                items          : 10
                
            });
            
            selector.on('typeahead:selected typeahead:autocompleted', function ($e,  datum) {
                console.log('ayo:', datum);
                debugger;
            });
        },
        
        getSource: function (options) {
            var objects = [];
            var data    = options.data;
            var self    = this;
            
            $.each(data, function(i, object) {
                self.map[object.filename] = object;
                
                objects.push(object.filename);
            });
            
            options.process(objects);
        }
    });
    
    return view;
});