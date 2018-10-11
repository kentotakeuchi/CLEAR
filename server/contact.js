var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
const password = require('./secret');

/* GET users listing. */
router.post('/', function(req, res, next) {
    console.log(req.body.email);
    console.log(req.body.inquiry);

    var email = req.body.email;
    var inquiry = req.body.inquiry;
    var content = `email: ${email} \n inquiry: ${inquiry} `;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'exaple@gmail.com',
            pass: password
        }
    });

    const mailOptions = {
        from: email, // sender address
        to: 'exaple@gmail.com', // list of receivers
        subject: 'New Message from Contact Form', // Subject line
        text: content// plain text body
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
            console.log(err);
        else
            console.log(info);
    });

    res.send('ok');
});

module.exports = router;

