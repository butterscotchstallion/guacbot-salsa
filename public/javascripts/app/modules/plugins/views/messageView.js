/**
 * Plugin message edit view
 *
 */
define('messageView', function (require) {
    "use strict";
    
    var Handlebars               = require('Handlebars');
    var Backbone                 = require('Backbone');
    var $                        = require('jquery');
    var _                        = require('underscore');
    var IRCColorParser           = require('IRCColorParser');
    var editTemplate             = require('text!/javascripts/app/modules/plugins/templates/messages/edit.html');
    var editTemplateCompiled     = Handlebars.compile(editTemplate);
    
    //var sidebarTemplate          = require('text!/javascripts/app/modules/plugins/templates/messages/edit-sidebar.html');
    //var sidebarTemplateCompiled  = Handlebars.compile(sidebarTemplate);
    
    var pluginMessageModel       = require('pluginMessageModel');
    var pluginMessageCollection  = require('pluginMessageCollection');
    var pluginSidebarView        = require('pluginSidebarView');
    var pluginMessageHeaderView  = require('pluginMessageHeaderView');
    var messageEditView          = require('messageEditView');

    var view = Backbone.View.extend({
        initialize: function () {            
            this.render();
        },
        
        render: function () {
            new pluginSidebarView();
            new pluginMessageHeaderView();
            new messageEditView();
        }
    });

    return view;
});