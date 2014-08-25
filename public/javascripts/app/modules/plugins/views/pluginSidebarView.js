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
    var sidebarTemplate          = require('text!/javascripts/app/modules/plugins/templates/plugin-sidebar.html');
    var sidebarTemplateCompiled  = Handlebars.compile(sidebarTemplate);
    var pluginMessageInfoModel   = require('pluginMessageInfoModel');
    var accountTokenModel        = require('accountTokenModel');
    
    var view = Backbone.View.extend({
        template  : sidebarTemplateCompiled,
        
        initialize: function () {
            var self = this;
            
            self.model = new pluginMessageInfoModel();
            
            self.listenTo(self.model, 'change', self.render, self);
            
            console.log('sidebar init');
            
            self.model.fetch({
                headers: {
                    "x-access-token": accountTokenModel
                }
            });
        },
        
        render  : function () {
            var modelJSON = this.model.toJSON();
            
            modelJSON = _.extend({
                id: window.app.pluginID
            }, modelJSON);
            
            $('.plugin-sidebar').html(this.template(modelJSON));
        }
    });
    
    return view;
});