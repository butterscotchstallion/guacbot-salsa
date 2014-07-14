/**
 * relatedMessageCollection
 *
 */
define('relatedMessageCollection', function (require) {
    var Backbone                = require('Backbone');
    var relatedMessagesModel    = require('relatedMessagesModel');
    
    var relatedMessageCollection = Backbone.Collection.extend({
        url       : "/api/v1/plugin-messages/" + window.app.pluginMessageID + "/related",

        model     : relatedMessagesModel,
        
        comparator: 'name'
    });

    return relatedMessageCollection;
    
});