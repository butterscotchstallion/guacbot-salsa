/**
 * relatedMessageCollection
 *
 */
define('relatedMessageCollection', function (require) {
    var Backbone                = require('Backbone');
    var relatedMessagesModel    = require('relatedMessagesModel');
    var pluginID                = window.app.pluginID;
    var pluginMessageID         = window.app.pluginMessageID;
    
    var relatedMessageCollection = Backbone.Collection.extend({
        url       : "/api/v1/plugins/" + pluginID + "/messages",

        model     : relatedMessagesModel,
        
        comparator: 'name'
    });

    return relatedMessageCollection;
    
});