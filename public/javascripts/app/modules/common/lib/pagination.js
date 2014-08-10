/**
 * pagination
 *
 */
"use strict";

var _ = require('underscore');

define('pagination', function (require) {
    
    var p = {};

    p.getInfo = function (options) {        
        var isCurrent  = false;
        var isFirst    = false;
        var isLast     = false;
        var serialized = "";
        var lastPage   = _.last(options.pages);
        var info       = {
            pages: []
        };
        
        _.each(options.pages, function (value, key) {
            isCurrent  = value == options.currentPage;
            isFirst    = value === 0;
            isLast     = lastPage;
            serialized = '?' + p.serialize(_.extend({
                limit  : options.limit,
                offset : options.offset,
                page   : value
            }, options.urlComponents));
            
            info.pages.push({
                isCurrent  : isCurrent,
                isFirst    : isFirst,
                isLast     : isLast,
                url        : serialized,
                displayText: value
            });
        });
        
        return info;
    };
    
    p.serialize = function(obj) {
        var str = [];
        
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        }
        
        return str.join("&");
    }

    return p;
    
});