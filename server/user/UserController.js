var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('./User');
var Item = require('../Item');
var Message = require('../message/Message');
var VerifyToken = require('../auth/VerifyToken');


// Profile modal.
router.get('/:userID', VerifyToken, function (req, res) {
    User.findOne({_id: req.params.userID}, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});

// Settings page.
router.put('/:userID', VerifyToken, function (req, res) {

    // Find user and update user information.
    User.findOneAndUpdate({_id: req.params.userID}, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");

        // Update userName in the ITEM collection.
        Item.update({userID: req.params.userID}, {userName: req.body.name}, {multi: true},  function(err, items) {

            if (err) return res.status(500).send("There was a problem updating the userName.");

            // Update sender name in the MESSAGE collection.
            Message.update({senderID: req.params.userID}, {sender: req.body.name}, {multi: true},  function(err, messages) {

                if (err) return res.status(500).send("There was a problem updating the sender name.");
                res.status(200).send(user);
            });
        });
    });
});

// Password page.
router.put('/password/:userID', VerifyToken, function (req, res) {
    //TODO: Fix error
    User.findOne({ _id: req.params.userID }, (err, user) => {
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

// Get user's current password to compare with user input.
router.get('/password/:userID', function (req, res) {
    User.findOne({_id: req.params.userID}, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(user);
    });
});


module.exports = router;


// Model.findOneAndUpdate(conditions, update, options, (error, doc) => {});

// DELETES A USER FROM THE DATABASE
// router.delete('/:id', function (req, res) {
//     User.findByIdAndRemove(req.params.id, function (err, user) {
//         if (err) return res.status(500).send("There was a problem deleting the user.");
//         res.status(200).send("User: "+ user.name +" was deleted.");
//     });
// });
