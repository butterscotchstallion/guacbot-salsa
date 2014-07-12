/**
 * Plugin model
 *
 */
"use strict";

var bookshelf = app.get('bookshelf');

var Plugin    = bookshelf.Model.extend({
    tableName: "plugins"
});

/*
p.getPlugins = function (options) {    
    var query = [
        'SELECT p.id, p.filename, p.name, p.enabled',
        'FROM plugins p',
        'WHERE 1=1'
    ].join (' ');
    
    options.db.connection.query(query, function (err, rows, fields) {
        options.callback({
            plugins : rows,
            error   : err
        });
    });
};
*/

module.exports = Plugin;