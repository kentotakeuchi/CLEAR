var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../user/User');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
var VerifyToken = require('./VerifyToken');


router.post('/register', function(req, res) {
  // Check if the user's name has already existed or not.
  User.findOne({ name: req.body.name }, (err, name) => {
    if (err) return handleDBError(err, res);
    if (name) return res.status(401).send('an account with this user\'s name already exists');

    // Check if the user's email has already existed or not.
    User.findOne({ email: req.body.email }, (err, email) => {
      if (err) return handleDBError(err, res);
      if (email) return res.status(409).send('an account with this user\'s email already exists');

      var hashedPassword = bcrypt.hashSync(req.body.password, 8);
      User.create({
        name : req.body.name,
        email : req.body.email,
        password : hashedPassword,

        img: '',
        dob: '',
        gender: '',
        location: '',
        description: ''
      },
      (err, user) => {
        if (err) return res.status(500).send("There was a problem registering the user.")
        // create a token
        var token = jwt.sign({ id: user._id }, config.secret, {
          expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token });
      });
    });
  });
});


// add the middleware function
router.use(function (user, req, res, next) {
  res.status(200).send(user);
});


router.post('/login', function(req, res) {
  // Name & Email validation.
  User.findOne({ name: req.body.name, email: req.body.email }, (err, user) => {
    if (err) return handleDBError(err, res);
    if (!user) return res.status(401).send('No user found.');

    // Email validation.
    // if (err) return res.status(500).send('Error on the server.');
    // if (!user.email) return res.status(404).send('No user email found.');

    // Password validation.
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send('Password is incorrect.');
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });

    User.findByIdAndUpdate(user._id, {$set: {
      tokens: {
        access: "auth",
        token: token
      }
    }
    }, {new: true}, function (err, user) {
      if (err) return res.status(500).send("There was a problem updating the user.");
      res.status(200).send({ auth: true, token: token });
    });
  });
});


router.get('/logout', VerifyToken, function(req, res) {
  var token = req.headers['x-access-token'];
  res.status(200).send({ auth: false, token: null });
});

module.exports = router;
