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


// Profile modal.
router.get('/:name', VerifyToken, function (req, res) {
    // TODO: Got error IF I put VerifyToken.
    User.findOne({name: req.params.name}, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});

// Settings page.
router.put('/:name', VerifyToken, function (req, res) {
    // User.findOne({ email: req.body.email }, (err, email) => {
    //     if (err) return handleDBError(err, res);
    //     if (email) return res.status(409).send('an account with this username already exists');
    // });

    User.findOneAndUpdate({name: req.params.name}, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});

// Password page.
router.put('/password/:name', VerifyToken, function (req, res) {
    //TODO: Fix error
    User.findOne({ name: req.params.name }, (err, user) => {
        // Current password validation.
        var passwordIsValid = bcrypt.compareSync(req.body.currentPassword, user.password);
        if (!passwordIsValid) return res.status(401).send('Current password is incorrect.');

        // Update password.
        var hashedPassword = bcrypt.hashSync(req.body.newPassword, 8);
        User.findOneAndUpdate({name: req.params.name}, {password: hashedPassword}, {new: true}, function (err, user) {

        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
        });
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