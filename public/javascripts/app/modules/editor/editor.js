/**
 * editor
 *
 *
 */
define('editor', ['jquery', 'Handlebars'], function ($, Handlebars) {
    
    var editor  = {};
    
    editor.init = function () {
        $(editor.onDocumentReady);
        
        //editor.processMessage();
    };
    
    editor.processMessage = function () {
        try {
            var payload = editor.tidyPayload($('#message').val());
            var rawData = $.trim($('#data').val());
            var data;
            
            if (rawData.length > 0) {
                data = JSON && JSON.parse(rawData) || $.parseJSON(rawData);
            }
            
            var message = editor.compile({
                message: payload,
                data   : data
            });
            
            editor.displayMessage(message);
            
        } catch (e) {
            editor.displayError(e);
        }         
    };
    
    editor.onDocumentReady = function () {
        // Set sample message/data
        $('#message').text(editor.getSampleMessage());
        $('#data').text(editor.getSampleData());
        
        // Handle form submit
        $('#editor-form').on('submit', function (e) {
            e.preventDefault();
            
            editor.processMessage();   
        });
    };
    
    editor.displayMessage = function (m) {
        $('#preview-text').removeClass('error')
                          .html(m);
    };
    
    editor.displayError = function (e) {
        editor.hidePreview();
        
        $('#preview-text').text('Error: ' + e)
                          .removeClass('hidden')
                          .addClass('error')
                          .show();
    };
    
    editor.hidePreview = function () {
        $('.preview-message').hide();
    };
    
    editor.compile = function (options) {
        var fmt = editor.formatMessage(options.message);
        var t   = Handlebars.compile(fmt);
        
        return t(options.data);
    };
    
    editor.formatMessage = function (m) {
        var o = m;
        
        o = editor.fixUnicode(o);
        o = editor.replaceUnicodeBoldWithHTMLBold(o);
        
        return o;
    };
    
    editor.fixUnicode = function (input) {
        return input.replace(
              /\\u([0-9a-f]{4})/g, 
              function (whole, group1) {
                return String.fromCharCode(parseInt(group1, 16));
              }
        );
    };
    
    editor.replaceUnicodeBoldWithHTMLBold = function (input) {
        return input.replace(/\u0002(.*?)\u0002/g, "<span class=\"irc-bold\">$1</span>");
    };
    
    editor.replaceUnicodeColorWithHTMLColors = function (input) {
        return input.replace(/\u0002(.*?)\u0002/g, "<span class=\"color-$1\">$1</span>");
    };
    
    editor.getSampleMessage = function () {
        var msg = '[{{{line}}}] \u0002{{{nick}}}\u0002 was last seen \u0002{{{timeAgo}}}\u0002 whispering sensually \u0002"{{{message}}}"\u0002';
    
        return editor.fixUnicode(msg);
    };
    
    editor.getSampleData = function () {
        var data = {
            nick   : "guacbot",
            timeAgo: "2 days ago",
            message: "hellooooo nurse!",
            line   : 1
        };
        
        return JSON.stringify(data, false, ' ');
    };
    
    editor.tidyPayload = function (p) {
        var o = p;
        
        if (o && typeof o === 'string') {
            o = $.trim(p);
        }
        
        return o;
    };
    
    return editor;
    
});

