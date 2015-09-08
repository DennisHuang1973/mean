/**
 * Created by DennisHuang on 15/08/24.
 */
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

console.info('Delete data start:');

db.Department.remove().exec();

console.info('Delete data end!');

console.info('insert multiple documents:');
var deps = [];

for(var idx = 0; idx < 20; idx ++){
    deps[idx]= {
        code: 'c11' + idx,
        name: 'dep20' + idx
    };
};

//db.Department.collection.insert(deps, function(err, docs){
//    if (err){
//        console.info(err) ;
//        //next(err) ;
//    }
//    else {
//        console.info('insert multiple documents finished!');
//        console.info(docs) ;
//    }
//});

db.Department.create(deps, function(err, docs){
    if (err){
        console.info(err) ;
        depInsert() ;
    }
    else {
        console.info('insert multiple documents finished!');
        console.info(docs) ;

        depInsert() ;
    }

});

var depInsert = function(){
    for(var idx = 0; idx < 20; idx ++){
        deps[idx]= {
            code: 'c0211' + idx,
            name: 'dep20' + idx
        };
    };

    db.Department.create(deps, function(err, docs){
        if (err){
            console.info(err) ;
        }
        else {
            console.info('insert multiple documents finished!');
            console.info(docs) ;
            db.Department.find().count(function(err, count){
                console.info('documents count:' + count) ;
                depDelete() ;
            });
        }

    });

};

var depDelete = function(){
    console.info('delete data:');
    db.Department.remove({name: /^dep201/}, function(err){
        if (err){
            console.info(err) ;
        }
        else {
            console.info('delete multiple documents finished!');
            //console.info(db.Department.find().count().exec()) ;
            db.Department.find().count(function(err, count){
                console.info('documents count:' + count) ;
                depUpdate();
            });
        }
    });
};

var depUpdate = function(){
    console.info('Start Update:');
    db.Department.update(
        {name: /^dep/},
        {
            $set: {
                //name: 'up' + this.name,
                //updated: Date.now,
                stop: true
            }
        },
        {
            multi: true
        },
        function(err, result){
            console.info('Update finished!');
            if (err){
                console.info(err);
            }
            else {
                console.info(result);
                depFindAll() ;
            }

    })

};

var depFindAll = function(){

    db.Department.find(function(err, docs){
        if (err){
            console.info(err);
        }
        else {
            console.info(docs) ;
        }

    });
}

module.exports = dbapp;