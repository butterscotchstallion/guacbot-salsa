/**
 * accountsTableItemView
 *
 */
"use strict";

define('accountsTableItemView', function (require) {
    var Backbone               = require('Backbone');
    var $                      = require('jquery');
    var Handlebars             = require('Handlebars');
    var accountItemTemplate    = require('text!/javascripts/app/modules/accounts/list/templates/account-row.html');
    var compiled               = Handlebars.compile(accountItemTemplate);
    
    var view = Backbone.View.extend({
        tagName   : 'tr',
        
        template  : compiled,
        
        initialize: function() {
        
        },
        
        render    : function() {
            var modelJSON = this.model.toJSON();
            var tpl       = this.template(modelJSON);

            this.$el.html(tpl);

            return this;
        }
    });
    
    return view;
});