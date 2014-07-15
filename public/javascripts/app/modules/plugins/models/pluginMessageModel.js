/**
 * plugin message model
 *
 */
define('pluginMessageModel', function (require) {
    "use strict";
    
    var Backbone      = require('Backbone');
    var pluginID                = window.app.pluginID;
    var pluginMessageID         = window.app.pluginMessageID;
    
    var pluginMessage = Backbone.Model.extend({
        idAttribute: 'id',
        url        : "/api/v1/plugins/" + pluginID + "/messages/" + pluginMessageID
    });
    
    return pluginMessage;
});
