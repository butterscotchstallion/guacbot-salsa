

define('pluginMessages', function (require) {
    var $  = require('jquery');
    var pm = {};

    pm.init = function () {
        pm.bindEventHandlers();
    };
    
    pm.bindEventHandlers = function () {
        $('.message-link').on('click', function (e) {
            e.preventDefault();
            
            $('#message-name').val($(this).data('message-name'));
            $('#message').val($(this).data('message'));
            $('#message-plugin').val($(this).data('plugin-name'));
        });
    };
    
    return pm;
    
});