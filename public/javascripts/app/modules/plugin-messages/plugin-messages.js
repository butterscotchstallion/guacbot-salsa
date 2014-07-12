

define('pluginMessages', function (require) {
    var $       = require('jquery');
    var pm      = {};
    var appView = require('appView');
    
    pm.init = function () {
        pm.bindEventHandlers();
    };
    
    pm.bindEventHandlers = function () {
        $('body').on('click', '.message-link', function (e) {
            e.preventDefault();
            
            $('#message-name').val($(this).data('message-name'));
            $('#message').val($(this).data('message'));
            $('#message-plugin').val($(this).data('plugin-name'));
        });
    };
    
    return pm;
    
});