/**
 * plugin message model
 *
 */
define('pluginMessageModel', function (require) {
    "use strict";
    
    var Backbone      = require('Backbone');

    var pluginMessage = Backbone.Model.extend({
        idAttribute: 'id',
        url        : "/api/v1/plugin-messages/" + window.app.pluginMessageID
    });
    
    return pluginMessage;
});
