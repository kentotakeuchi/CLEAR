const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: String,
    password: String,

    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;