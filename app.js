var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express3-handlebars');
var fs            = require('fs');

// intentional global variable
var app = express();

app.engine('.html', expressHbs({
    extname      : '.html',
    defaultLayout: 'main',
    layoutsDir   : 'views/layouts'
}));

app.set('view engine', '.html');

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.set('bookshelf', bookshelf);

app.use('/', require('./routes/index'));

// API
app.use('/api/v1/plugins',      require('./routes/api/plugins'));
app.use('/api/v1/logs',         require('./routes/api/logger'));
app.use('/api/v1/autocomplete', require('./routes/api/autocomplete'));

app.use('/plugins',             require('./routes/plugins'));

process.on('error', function (e) {
    console.log(e.stack);
});

// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        
        console.log('500: ', err);
        
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
