/**
 * accessController
 *
 */
define('accessController', function (require) {
    'use strict';

    var Backbone = require('Backbone');
    var _        = require('underscore');
    var jStorage = require('jStorage');
    
    console.log('hello world!');
    
    /*
     * Store a version of Backbone.sync to call
     * with modified options
     */
    var backboneSync = Backbone.sync,

    /**
     * New error is a currying function. You pass in a method,
     * success function, and error function and it returns a
     * new error function that will call the success function if
     * a 'sucess code' corresponds to the method.
     */
    newError = function (method, success, error) {
        // Each method can have its own specific success code
        var successCodes = {
            create: 201,
            read  : 200
        };
        
        // Return the original error function if no matching 'success code'
        if (!successCodes[method]) {
            return error;
        }

        return function (jqXHR, textStatus, errorThrown) {
            jqXHR.setRequestHeader("x-access-token", $.jStorage.get('token'));
            
            // If the response is a success code 
            var wasSuccessful = jqXHR.status === successCodes[method],
                response;

            // If the status is a 'success code' run the success function
            if (wasSuccessful && _.isFunction(success) ) {

                // Set the response if there is one
                response = jqXHR.responseJSON ? jqXHR.responseJSON : {}; 

                // Call the success function
                success(response, textStatus, jqXHR);

            // Otherwise run the error as usual
            } else if (_.isFunction(error)) {

                // Call the original error function
                error(jqXHR, textStatus, errorThrown);
            }
        };
    };

    // Override Backbone.sync
    Backbone.sync = function (method, model, options) {
        var success, error;
        
        // Set options to error to the new error function
        options.error = newError(method, success, error);
        options.headers = {
            "x-access-token": $.jStorage.get('token')
        };
        
        // Call the stored original Backbone.sync method with the new settings
        backboneSync(method, model, options); 
    };
});