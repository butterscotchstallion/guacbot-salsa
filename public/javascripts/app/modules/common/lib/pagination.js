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
        var offset     = 0;
        var next       = 0;
        var prev       = 0;
        var canPrev    = false;
        var canNext    = false;
        var serialized = "";
        var lastPage   = _.last(options.pages);
        var info       = {
            pages: []
        };
        
        if (options.currentPage > 1) {
            prev    = options.currentPage - 1;
            canPrev = true;
        }
        
        if (options.currentPage < lastPage) {
            next    = options.currentPage + 1;
            canNext = true;
        }
        
        var urlParams  = _.extend({
            limit  : options.limit            
        }, options.urlComponents);
        
        info.isFirst   = options.currentPage === 1;
        info.isLast    = options.currentPage === lastPage;
        info.prevURL   = '?' + p.serialize(_.extend(urlParams, {
            page: prev
        }));
        info.nextURL   = '?' + p.serialize(_.extend(urlParams, {
            page: next
        }));
        
        _.each(options.pages, function (value, key) {
            isCurrent  = value == options.currentPage;
            offset     = (options.limit * value);
            serialized = '?' + p.serialize(_.extend(urlParams, {
                offset : offset,
                page   : (offset / options.itemsPerPage)
            }));
            
            info.pages.push({
                isCurrent  : isCurrent,
                url        : serialized,
                displayText: value,
                lastPage   : lastPage,
                canNext    : canNext,
                canPrev    : canPrev
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