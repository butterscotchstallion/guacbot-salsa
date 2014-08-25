/**
 * accountTokenModel
 *
 *
 */
"use strict";

define('accountTokenModel', function (require) {
    var jStorage = require('jStorage');
    
    var token = $.jStorage.get('token');
    
    return token;
});