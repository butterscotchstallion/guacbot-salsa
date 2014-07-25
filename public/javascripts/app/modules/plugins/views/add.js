/**
 * Plugin message edit view
 *
 */
define('addView', function (require) {
    "use strict";
    
    var Handlebars               = require('Handlebars');
    var Backbone                 = require('Backbone');
    var $                        = require('jquery');
    var _                        = require('underscore');
    var addTemplate             = require('text!/javascripts/app/modules/plugins/templates/messages/add.html');
    var addTemplateCompiled     = Handlebars.compile(addTemplate);

    var addView = Backbone.View.extend({
        el        : $('.add-container'),
        
        template  : addTemplateCompiled,
        
        initialize: function () {
            this.render();
        },
        
        render   : function () {
            var tpl = this.template();
            
            this.$el.html(tpl);
        }
    });
    
    return addView;
});