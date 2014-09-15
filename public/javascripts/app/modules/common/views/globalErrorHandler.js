/**
 * Global Error Handler - used primarily to redirect to the login
 * page when the API serves a 400 - used to indicate the session has expired
 *
 */
define('globalErrorHandler', function (require) {
    var $ = require('jquery');
    
    $(document).ajaxError(function(event, jqxhr, settings, thrownError) {
        var statusCode = jqxhr.status;
        
        var isLoginPage = window.location.href.indexOf('session/new') !== -1;
        var errorCodes  = [404, 400];
        
        if (errorCodes.indexOf(statusCode) !== -1 && !isLoginPage) {
            window.location = "/session/new?error=expired&return=" + window.location.pathname;
        }
    });
});