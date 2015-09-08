/**
 * Created by DennisHuang on 15/08/21.
 */
var mongoose = require('mongoose');
var schema = mongoose.Schema;

var departmentSchema = new schema({
    code: {
        required: true,
        type: String,
        trim: true,
        unique: true,
        index: true
    },
    name: {
        required: true,
        type: String,
        trim: true
        //unique: true
    },
    stop: {
        type: Boolean,
        default: false
    },
    updated: {
        type: Date,
        default: Date.now
    }

});

var Dep = mongoose.model('Department', departmentSchema);

Dep.schema.path('code').validate(function(value){
    return value.length >=6 && value.length <= 12;

}, 'Code should be between 6 and 12 character.');
