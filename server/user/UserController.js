var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('./User');
var VerifyToken = require('../auth/VerifyToken');


/*
// CREATES A NEW USER
router.post('/', function (req, res) {
    User.create({
            email : req.body.email,
            password : req.body.password
        },
        function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user);
        });
});
*/

// RETURNS ALL THE USERS IN THE DATABASE
// router.get('/', function (req, res) {
//     User.find({}, function (err, users) {
//         if (err) return res.status(500).send("There was a problem finding the users.");
//         res.status(200).send(users);
//     });
// });

// GETS A SINGLE USER FROM THE DATABASE
// router.get('/:id', function (req, res) {
//     User.findById(req.params.id, function (err, user) {
//         if (err) return res.status(500).send("There was a problem finding the user.");
//         if (!user) return res.status(404).send("No user found.");
//         res.status(200).send(user);
//     });
// });

// DELETES A USER FROM THE DATABASE
// router.delete('/:id', function (req, res) {
//     User.findByIdAndRemove(req.params.id, function (err, user) {
//         if (err) return res.status(500).send("There was a problem deleting the user.");
//         res.status(200).send("User: "+ user.name +" was deleted.");
//     });
// });

// Settings page.
router.put('/:userEmail', VerifyToken, function (req, res) {
    console.log(req.params.userEmail);
    // User.findOne({ email: req.body.email }, (err, email) => {
    //     if (err) return handleDBError(err, res);
    //     if (email) return res.status(409).send('an account with this username already exists');
    // });

    User.findOneAndUpdate(req.params.userEmail, req.body, {new: true}, function (err, user) {

        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});

// Password page.
router.put('/password/:userEmail', VerifyToken, function (req, res) {
    console.log(req.params.userEmail);
    console.log(req.body);
    // MEMO: compare req.body.currentPassword === current password in the mongoDB.

    // var hashedPasswordCurrent = bcrypt.hashSync(req.body.currentPassword, 8);
    var hashedPassword = bcrypt.hashSync(req.body.newPassword, 8);

    // User.findOne({ password: req.body.currentPassword }, (err, pwd) => {
    //     if (err) return handleDBError(err, res);
    //     if (!pwd) return res.status(409).send('Current password is incorrect.');
    // });

    User.findOneAndUpdate({email: req.params.userEmail}, {password: hashedPassword}, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});

// Model.findOneAndUpdate(conditions, update, options, (error, doc) => {});

module.exports = router;