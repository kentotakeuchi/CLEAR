var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
const password = require('./secret');

/* GET users listing. */
router.post('/', function(req, res, next) {
    var email = req.body.email;
    var inquiry = req.body.inquiry;
    var content = `email: ${email} \n inquiry: ${inquiry} `;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ideal.kt.reality@gmail.com',
            pass: password
        }
    });

    const mailOptions = {
        from: email, // sender address
        to: 'ideal.kt.reality@gmail.com', // list of receivers
        subject: 'New Message from Contact Form', // Subject line
        text: content// plain text body
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
            console.log(err);
        else
            console.log(info);
    });
    res.send('Success.');
});

module.exports = router;

