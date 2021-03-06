

require.config({
    baseUrl: "/javascripts",
    
    urlArgs: "bust=" + (new Date()).getTime(),
    
    paths: {
        jquery          : "lib/jquery.min",
        bootstrap       : "lib/bootstrap.min",
        requireLib      : "lib/require.min",
        Handlebars      : "lib/handlebars",
        Backbone        : "lib/backbone.min",
        text            : "lib/text",
        underscore      : "lib/underscore.min",
        jStorage        : "lib/jstorage",
        typeahead       : "lib/typeahead",
        moment          : "lib/moment",
        "jquery.fileupload": "lib/jquery-file-upload/jquery.fileupload",
        "jquery.ui.widget"  : "lib/jquery-file-upload/jquery.ui.widget",
        "jquery.iframe-transport" : "lib/jquery-file-upload/jquery.iframe-transport",
        "jquery.fileupload-ui": "lib/jquery-file-upload/jquery.fileupload-ui",
        "jquery.fileupload-image": "lib/jquery-file-upload/jquery.fileupload-image",
        
        common             : "app/modules/common/main",
        
        accountsModel      : "app/modules/accounts/models/accountsModel",
        accountTokenModel: "app/modules/accounts/models/accountTokenModel",
         
        // collections
        pluginCollection   : "app/modules/plugins/collections/pluginCollection",
        
        // views
        pluginsMenuView    : "app/modules/common/views/pluginsMenu",
        pluginsMenuItemView: "app/modules/common/views/pluginsMenuItem",
        menuSearchView     : "app/modules/common/views/menuSearchView",
        profileView        : "app/modules/accounts/profile/views/profileView",
        sessionInfoHeaderItemView: "app/modules/session/views/sessionInfoHeaderItemView"
    },
    shim: {
        bootstrap: {
            deps: ['jquery']
        },
        Handlebars: {
            exports: 'Handlebars'
        },
        Backbone: {
            exports: 'Backbone',
            deps   : ['jquery', 'underscore']
        },
        underscore: {
            exports: '_'
        },
        jStorage: {
            deps: ['jquery']
        },
        profileView: {
            deps: ['Backbone']
        },
        "jquery.fileupload": {
            deps: ["jquery.iframe-transport", "jquery.ui.widget", 'jquery']
        },
        'jquery.fileupload-ui': {
            deps: ["jquery.fileupload-image"]
        }
    }
});

require(["jquery", "common", "profileView"], function ($, common, profileView) {
    $(function () {
        new profileView();
    });
});








