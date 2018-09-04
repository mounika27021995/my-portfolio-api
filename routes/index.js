var express = require('express');
var router = express.Router();
var User = require('../model/userModel');
var md5 = require('js-md5');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

function SendMail(data, res)
{ 
  var nodemailer = require('nodemailer');
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'siddulamounika@gmail.com',
      pass: 'mounika'
    }
  });
  
  var mailOptions = {
    from: 'siddulamounika@gmail.com',
    to: data.email,
    subject: 'Thank you ' + data.name + ' for visiting my Portfolio',
    text: 'We have received your contact information.'
  };
  console.log(data.email);
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      //res.json({code: 500, message: 'Something went wrong in email after contact save'});
      res.json({code: 200, data: data}); 
  } else {
      console.log('Email sent: ' + info.response);
      res.json({code: 200, data: data}); 
    }
  });
}

router.post('/contact', function(req, res, next) {
  // read the values passed from the ui
  var data = req.body;
  console.log(JSON.stringify(data));
  
  var Contact = require('../model/contactModel');
  var newContact = new Contact();
  newContact.name = data.name;
  newContact.email = data.email;
  newContact.mobile = data.mobile;
  newContact.description = data.description;
  newContact.createAt = new Date();
  newContact.save(function(err, savedContact){
    console.log(JSON.stringify(savedContact));
    if(err){
      res.json({code: 500, message: 'Something went wrong in contact save'});
    }else{
      console.log('contact saved');
      SendMail(data, res);      
    }
    

  });

});

router.get('/signin', function(req, res, next) {
  var pObject = req.body;
  User.find({'email': pObject.email, 'password': pObject.password}, function(err, user){
    if(err){
      res.json({code: 500, message: 'Something went wrong in signin'});
    }else{
      res.json({code: 200, data: user}); 
    }
  });
});

router.post('/signup', function(req, res, next) {
  // read the values from the body
  // [ take the password and encrypt it ]
  // use the model and save the data
  console.log("signup");
  console.log(req.body.name);
  var userModel = new User();
  userModel.name = req.body.name;
  userModel.email = req.body.email;
  userModel.password = md5(req.body.password);
  userModel.createAt = new Date();
  console.log("signing up");
  userModel.save(function(err, user){
  //console.log(JSON.stringify(user));
  console.log(err);
    if(err){
      res.json({code: 500, message: 'Something went wrong in get signup'});
    }else{
      res.json({code: 200, data: user}); 
    }
  });
});

module.exports = router;
