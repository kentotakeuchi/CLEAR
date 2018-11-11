var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
const password = require('./secret');
const myEmail = require('./secret2');

/* GET users listing. */
router.post('/', function(req, res, next) {
    var email = req.body.email;
    var inquiry = req.body.inquiry;
    var content = `email: ${email} \n inquiry: ${inquiry} `;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: myEmail,
            pass: password
        }
    });

    const mailOptions = {
        from: email, // sender address
        to: myEmail, // list of receivers
        subject: 'New Message from Contact Form', // Subject line
        text: content// plain text body
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
            res.send('A problem has been occurred while submitting your data.');
        else
            res.send('Your message has been sent successfully.');
    });
});

module.exports = router;

