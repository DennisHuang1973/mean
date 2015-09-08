/**
 * Created by DennisHuang on 15/08/20.
 */
var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = new schema({
    username: {
        type: String,
        trim: true,
        unique: true
    },
    password: String
});

mongoose.model('User', userSchema);