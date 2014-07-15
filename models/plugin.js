/**
 * Plugin model
 *
 */
"use strict";

var bookshelf = app.get('bookshelf');

var Plugin    = bookshelf.Model.extend({
    tableName: "plugins"
});

module.exports = Plugin;