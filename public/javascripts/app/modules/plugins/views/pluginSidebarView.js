/**
 * Plugin sidebar view
 *
 */
define('pluginSidebarView', function (require) {
    "use strict";
    
    var Handlebars               = require('Handlebars');
    var Backbone                 = require('Backbone');
    var $                        = require('jquery');
    var _                        = require('underscore');
    var IRCColorParser           = require('IRCColorParser');
    var sidebarTemplate          = require('text!/javascripts/app/modules/plugins/templates/plugin-sidebar.html');
    var sidebarTemplateCompiled  = Handlebars.compile(sidebarTemplate);
    
    var view = Backbone.View.extend({
        el      : $('.plugin-sidebar'),
        
        template: sidebarTemplateCompiled,
        
        initialize: function () {
            this.render();
        },
        
        render  : function () {
            this.$el.html(this.template());
        }
    });
    
    return view;
});