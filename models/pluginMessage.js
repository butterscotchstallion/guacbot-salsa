/**
 * Plugin Messages model
 *
 */
"use strict";

var pm = {};

pm.getMessages = function (options) {
    var pluginFilter = '';
    var nameFilter   = '';
    var params       = [];
    
    if (options.query.plugin && options.query.plugin.length > 0) {
        pluginFilter = "AND p.filename = ?";
        params.push(options.query.plugin);
    }
    
    if (options.query.name && options.query.name.length > 0) {
        nameFilter = "AND pm.name = ?";
        params.push(options.query.name);
    }
    
    var cols  = ['pm.id', 'pm.name', 'pm.message', 'p.name AS pluginName', 'p.filename'];
    var query = [
        "SELECT " + cols.join(', '),
        "FROM plugin_messages pm",
        "JOIN plugins p ON p.id = pm.plugin_id",
        "WHERE 1=1",
        pluginFilter,
        nameFilter,
        "ORDER BY p.name"
    ].join(' ');
    
    options.db.connection.query(query, params, function (err, rows, fields) {
        options.callback({
            messages: rows,
            error   : err
        });
    });
};

module.exports = pm;

