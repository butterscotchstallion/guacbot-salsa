/**
 * Plugin message edit view
 *
 */
define('messageView', function (require) {
    "use strict";
    var Backbone                 = require('Backbone');
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