var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var Message = require('../message/Message');
var VerifyToken = require('../auth/VerifyToken');


router.post('/', VerifyToken, (req, res) => {
    if (!req.body) return res.sendStatus(400);

    var message = new Message({
        itemName: req.body.itemName,
        sender: req.body.sender,
        recipient: req.body.recipient,
        isRead: req.body.isRead,
        message: req.body.message
    });


    message.save(err => {
        if (err) {
            res.end(err);
        }
        res.end('You have successfully sent message!');
    });
});

router.get('/:userEmail', VerifyToken, (req, res) => {
    Message.find({
        recipient: req.params.userEmail
    })
    .then(messages => {
        res.send(messages);
    })
    .catch(err => {
        res.send(err);
    });
});

router.delete('/:id', VerifyToken, (req, res) => {
    Message.findByIdAndRemove(req.params.id, (err) => {
        if (err) return res.send(err);
        res.send('Deleted successfully!');
    });
});

module.exports = router;