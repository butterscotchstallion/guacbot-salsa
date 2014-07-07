

define('app', function (require) {
    var $              = require('jquery');
    var bootstrap      = require('bootstrap');
    var pluginMessages = require('pluginMessages');
    
    $(function () {
        console.log('ready');
        
        pluginMessages.init();
    });
});