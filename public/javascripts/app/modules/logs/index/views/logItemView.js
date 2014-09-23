/**
 * logItemView
 *
 */
"use strict";

define('logItemView', function (require) {
    var Backbone               = require('Backbone');
    var $                      = require('jquery');
    var Handlebars             = require('Handlebars');
    var logItemTemplate        = require('text!/javascripts/app/modules/logs/index/templates/log-item-row.html');
    var compiled               = Handlebars.compile(logItemTemplate);
    var moment                 = require('moment');
    
    var view = Backbone.View.extend({
        tagName   : 'tr',
        
        template  : compiled,
        
        initialize: function() {
        
        },
        
        render    : function() {
            var modelJSON = this.model.toJSON();
            var tpl       = this.template(_.extend({
                createdAtFormatted: moment(this.model.get('ts')).format("MMM MM HH:mm:ss"),
                channelWithoutHash: this.model.get('channel').replace("#", "")
            }, modelJSON));

            this.$el.html(tpl);

            return this;
        }
    });
    
    return view;
});