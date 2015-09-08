var myDb = require('../Db/myDb');
var db = myDb() ;

var express = require('express');
var router = express.Router();
var self = this ;
var path = require('path');
//this.users = [{
//  username: 'aaa',
//  password: 'bbb'
//}, {
//  username: 'aa',
//  password:'bb'}
//];
//
//this.findByName = function (req, res, next) {
//
//  var username = req.param('username');
//  self.users.forEach(function(user){
//    if (user.username == username){
//      return user ;
//    };
//
//    return null ;
//  });
//
//};

this.loginUser = function(req, res, next){
  //var username = req.body.username;
  //var password = req.body.password;
  //var succ = false ;
  //self.users.forEach(function(user){
  //  if ((user.username == username) && (user.password == password)){
  //    succ = true ;
  //}});
  //if (succ) {
  //  res.redirect('/users?username=' + username);
  //}
  //else {
  //  res.redirect('/') ;
  //};
  var loginUser = new db.User(req.body);
  db.User.findOne({username: loginUser.username, password: loginUser.password},
      function(err, user){
        if (err){
          return next(err);
        }
        else if (user){
          res.redirect('/users?username=' + user.username);
        }
        else {
          res.redirect('/') ;
        }
  });

};

this.addUser = function(req, res, next){
  //var username = req.body.username;
  //var password = req.body.password;
  //self.users.push({username: username, password: password});
  //res.send(true);

  var user = new db.User(req.body);

  user.save(function(err){
    if (err){
      //return next(err);
      res.send({result:false, message: err.errmsg});
    }
    else {
      res.send({result:true});
    }
  });

};

this.delUser = function(req, res, next){
  //var index = req.body.index;
  //self.users.splice(index, 1);
  //
  //res.send(true);
  var id = req.query.id;
  db.User.findByIdAndRemove(id, function(err){
    if (err){
      next(err);
    }
    else {
      res.send({result:true});
    }
  });

};

this.getUser = function(req, res, next) {
  //var username = req.param('username');
  //res.render('users',{title:'user list', users: self.users});
  db.User.find({}, function(err, users){
    if (err){
      return next(err);
    }
    else {
      //res.render('users',{title:'user list', users: users});
      var filepath = path.join(__dirname, '../public/html', 'users2.html');
      res.sendFile(filepath);
    };

  })

};

/* GET users listing. */
//router.get('/', this.getUser);
//router.post('/', this.loginUser);
//router.put('/', this.addUser);
//router.delete('/', this.delUser);

this.getAllUser = function(req, res, next){
  db.User.find(null, '-password', function(err, users){
    if (err){
      res.send({result: false, message: err.message});
    }
    else {
      res.send({result: true, users: users});
    }

  });
};

this.updateUser = function(req, res, next){
    var user = new db.User(req.body);
    user.update({username: user.username}, function(err){
        if (err){
            //return next(err);
            res.send({result:false, message: err.errmsg});
        }
        else {
            res.send({result:true});
        }
    });
}

router.route('/all')
    .get(this.getAllUser);

router.route('/api')
.get(this.getAllUser)
.put(this.updateUser)
.post(this.addUser)
.delete(this.delUser);

router.route('/')
.get(this.getUser)
.put(this.updateUser)
.post(this.addUser)
.delete(this.delUser);



module.exports = router;