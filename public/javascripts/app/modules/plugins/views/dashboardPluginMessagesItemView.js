

define('dashboardPluginMessagesItemView', function (require) {
    var Backbone   = require('Backbone');
    var $          = require('jquery');
    var Handlebars = require('Handlebars');
    var tplFile    = require('text!/javascripts/app/modules/plugins/templates/dashboardPluginMessagesItem.html');
    var template   = Handlebars.compile(tplFile);
    
    var view = Backbone.View.extend({
        tagName   : 'tr',
        
        template  : template,
        
        initialize: function() {
        
        },
        
        render    : function() {
            var modelJSON = this.model.toJSON();
            
            // We want to render the messages so let's make up some sweet
            // fake data for display purposes and add a property representing
            // that compiled message.
            var data      = {
                "recipient" : "PrgmrBill",
                "nick"      : "Cayenne",
                "message"   : "Biggie Smalls is da illest",
                "originNick": "Bruce Lee",
                "timeAgo"   : "2 days ago",
                "line"      : 1
            };
            
            var msgTpl      = Handlebars.compile(this.model.get('message'));
            var compiledMsg = msgTpl(data);            
            var tpl         = this.template(_.extend({
                compiledMsg: compiledMsg
            }, modelJSON));
            
            this.$el.html(tpl);

            return this;
        }
    });
    
    return view;
});