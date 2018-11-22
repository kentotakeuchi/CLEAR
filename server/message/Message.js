const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    senderID: {
        type: String
    },
    recipientID: {
        type: String
    },
    sender: {
        type: String
    },
    recipient: {
        type: String
    },
    itemName: {
        type: String
    },
    isRead: {
        type: Boolean,
        default: false
    },
    message: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;