/**
 * pluginMessageCollection
 *
 */
define('pluginMessageCollection', function (require) {
    var Backbone                = require('Backbone');
    var pluginMessageModel      = require('pluginMessageModel');
    
    var pluginMessageCollection = Backbone.Collection.extend({
        url       : '/api/v1/plugin-messages/list',

        model     : pluginMessageModel
    });

    return pluginMessageCollection;
    
});