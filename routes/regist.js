var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('regist', { title: 'Welcome join use!' });
});

/* GET users listing. */
router.put('/', function(req, res, next) {
    //res.send('respond with a resource');
    var username = req.body.username;
    var password = req.body.password;

    res.send('Welcome!' + username) ;
});

module.exports = router;
/**
 * Created by DennisHuang on 15/08/18.
 */
