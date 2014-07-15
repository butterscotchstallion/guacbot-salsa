/**
 * Parses IRC color codes and converts to HTML tags that can be styled
 * Adapted from http://hawkee.com/snippet/10164/
 *
 */
define('IRCColorParser', function (require) {
    "use strict";
    
    var parser = {};

    parser.parse = function (options) {
        //var pattern = /\003([0-9]{1,2})[,]?([0-9]{1,2})?([^\003]+)/;
        var pattern = /\\u[0-9]{6}/;
        var matches;
        var colors;
        var text = options.input;
        var html;
        var controlCodeMatches;
        var backgroundColor;
        
        if (pattern.test(text)) {
            while (controlCodeMatches = pattern.exec(text)) {
                if (controlCodeMatches[2]) {
                    backgroundColor = cp[2];
                }
                
                console.log(controlCodeMatches);
                
                html = [
                    '<span class="fg',
                    controlCodeMatches[0],
                    ' bg',
                    backgroundColor,
                    '">',
                    controlCodeMatches[0],
                    '</span>'
                ].join('');
                
                text = text.replace(controlCodeMatches[0], html);
            }
        }
        
        var codes = [
            [/\002([^\002]+)(\002)?/, ["<strong>","</strong>"]],
            [/\037([^\037]+)(\037)?/, ["<u>","</u>"]],
            [/\035([^\035]+)(\035)?/, ["<i>","</i>"]]
        ];
        
        var bmatch;
        
        for (var i = 0; i < codes.length; i++) {
            var bc    = codes[i][0];
            var style = codes[i][1];
            
            if (bc.test(text)) {
                while (bmatch = bc.exec(text)) {
                    var text = text.replace(bmatch[0], style[0]+bmatch[1]+style[1]);
                }
            }
        }
        
        return text;
    };
    
    return parser;
    
});