/**
 * plugin message model
 *
 */
define('pluginMessageModel', function (require) {
    "use strict";
    
    var Backbone      = require('Backbone');

    var pluginMessage = Backbone.Model.extend({
        idAttribute: 'id',
        
        defaults: {
           //name: "lol"
        }        
    });
    
    return pluginMessage;
});
