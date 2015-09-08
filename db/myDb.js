/**
 * Created by DennisHuang on 15/08/20.
 */
var express = require('express');
var mongoose = require('mongoose');


module.exports = function(){
    var self = this ;
    var uri = 'mongodb://localhost/myHomework';

    var myDb = mongoose.connect(uri);

    require('../Db/user.model');
    require('../Db/department.model');

    myDb.User = mongoose.model('User');
    myDb.Department = mongoose.model('Department');

    return myDb;
};
