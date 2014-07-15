/**
 * pluginMessageCollection
 *
 */
define('pluginMessageCollection', function (require) {
    var Backbone                = require('Backbone');
    var pluginMessageModel      = require('pluginMessageModel');
    var pluginID                = window.app.pluginID;
    
    var pluginMessageCollection = Backbone.Collection.extend({
        url       : '/api/v1/plugins/' + pluginID + '/messages',

        model     : pluginMessageModel,
        
        comparator: function (model) {
            return model.get('plugin').name;
        }
    });

    return pluginMessageCollection;
    
});