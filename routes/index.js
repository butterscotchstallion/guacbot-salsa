var express = require('express');
var router  = express.Router();
var fs      = require('fs');
var db      = require('../app/db');
var when    = require('when');
var config  = JSON.parse(fs.readFileSync("./config/db.json", 'utf8'));

db.init(config, function () {
    console.log('connected');
});

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { 
        title: "Salsa",
        isHomepage: true        
    });
});

router.get('/plugin-messages', function(req, res) {
    var url    = require('url');
    var parts  = url.parse(req.originalUrl, true);
    var query  = parts.query;
    var params = [];
    var pluginFilter = "";
    var nameFilter = "";
    
    if (query.plugin && query.plugin.length > 0) {
        pluginFilter = "AND p.filename = ?";
        params.push(query.plugin);
    }
    
    if (query.name && query.name.length > 0) {
        nameFilter = "AND pm.name = ?";
        params.push(query.name);
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
    
    db.connection.query(query, params, function (err, rows, fields) {
        res.render('plugin-messages/list', { 
            title               : 'Plugin Messages - List',
            isPluginMessagesPage: true,
            messages            : rows
        });
    });
});

// API
//router.get('/plugin-messages/list', function(req, res) {
//    res.json(messages);
//});

module.exports = router;
















