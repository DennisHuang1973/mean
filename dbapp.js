var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var routes = require('./routes/index');
//var users = require('./routes/users');
////var login = require('./routes/login');
//var regist = require('./routes/regist');

var dbapp = express();
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
dbapp.use(logger('dev'));
dbapp.use(bodyParser.json());
dbapp.use(bodyParser.urlencoded({ extended: false }));
dbapp.use(cookieParser());
dbapp.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
dbapp.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (dbapp.get('env') === 'development') {
    dbapp.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
dbapp.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var myDb = require('./Db/myDb');
var db = myDb() ;
console.info('start demo!');

console.info('Delete data start:');

db.Department.remove().exec();

console.info('Delete data end!');

console.info('1: Create');

var dep = new db.Department({
    code: 'c001',
    name: 'dep1'
});

dep.save(function(err, doc){

    if (err){
        console.info(err) ;
        next(err) ;
    }
    else {
        var id = doc.id;
        console.info('Insert Success, id:' + id);
    }

});

setTimeout(function(){

dep.set("code", "c000001");

dep.save(function(err, doc){

    if (err){
        console.info(err) ;
        next(err) ;
    }
    else {
        var id = doc.id;
        console.info('Insert Success, id:' + id);
    }

});

}, 2000) ;


module.exports = dbapp;
