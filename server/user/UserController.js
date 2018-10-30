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


// GETS A SINGLE USER FROM THE DATABASE
router.get('/:name', function (req, res) {
    // TODO: Got error IF I put VerifyToken.
    User.findOne({name: req.params.name}, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});

// Settings page.
router.put('/:name', VerifyToken, function (req, res) {
    console.log(req.params.name);
    // User.findOne({ email: req.body.email }, (err, email) => {
    //     if (err) return handleDBError(err, res);
    //     if (email) return res.status(409).send('an account with this username already exists');
    // });

    User.findOneAndUpdate(req.params.name, req.body, {new: true}, function (err, user) {

        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});

// Password page.
router.put('/password/:name', VerifyToken, function (req, res) {
    console.log(req.params.name);
    console.log(req.body);
    // MEMO: compare req.body.currentPassword === current password in the mongoDB.

    var hashedPasswordCurrent = bcrypt.hashSync(req.body.currentPassword, 8);
    var hashedPassword = bcrypt.hashSync(req.body.newPassword, 8);

    // Current password validation.
    User.findOne({ password: req.body.hashedPasswordCurrent }, (err, pwd) => {
        if (err) return handleDBError(err, res);
        if (!pwd) return res.status(409).send('Current password is incorrect.');
    });

    // Update password.
    User.findOneAndUpdate({name: req.params.name}, {password: hashedPassword}, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});

// Model.findOneAndUpdate(conditions, update, options, (error, doc) => {});

// RETURNS ALL THE USERS IN THE DATABASE
// router.get('/', function (req, res) {
//     User.find({}, function (err, users) {
//         if (err) return res.status(500).send("There was a problem finding the users.");
//         res.status(200).send(users);
//     });
// });

// DELETES A USER FROM THE DATABASE
// router.delete('/:id', function (req, res) {
//     User.findByIdAndRemove(req.params.id, function (err, user) {
//         if (err) return res.status(500).send("There was a problem deleting the user.");
//         res.status(200).send("User: "+ user.name +" was deleted.");
//     });
// });

module.exports = router;