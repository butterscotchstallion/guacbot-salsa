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
    var pluginMessageModel       = require('pluginMessageModel');
    
    var view = Backbone.View.extend({
        initialize: function (options) {
            this.model      = options.model;
            this.isNew      = options.isNew;
            this.collection = options.collection;
            
            this.render();
        },
        
        render: function () {            
            new pluginSidebarView();
            new pluginMessageHeaderView({
                model: this.model
            });
            new messageEditView({
                isNew     : this.isNew,
                model     : this.model,
                collection: this.collection
            });
        }
    });

    return view;
});