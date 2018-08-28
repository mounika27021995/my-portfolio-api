var express = require('express');
var router = express.Router();
var User = require('../model/userModel');
var md5 = require('js-md5');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/signin', function(req, res, next) {
  var email = req.body.email;
  var password = md5(req.body.password);
  User.find({'email': email, 'password': password}, function(err, user){
    if (err){
      res.json({code: 200, error: err});
    }else if (user.length < 1){
      res.json({code: 200, error: {msg: "Invalid userid or passsword"}});
    }else{
      res.json({code: 200, data: user});
    }
  });
});

router.post('/signup', function(req, res, next) {
  // read the values from the body
  // [ take the password and encrypt it ]
  // use the model and save the data
  var userModel = new User();
  userModel.name = req.body.name;
  userModel.email = req.body.email;
  userModel.password = md5(req.body.password);
  userModel.createAt = new Date();
  userModel.save(function(err, user){
    console.log(JSON.stringify(user));
    if(err){
      res.json({code: 200, error: err});
    }else{
      res.json({code: 200, data: user});
    }
  });
});
module.exports = router;