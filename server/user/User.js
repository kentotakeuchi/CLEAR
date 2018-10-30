const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,

    img: String,
    dob: Date,
    gender: String,
    location: String,
    description: String,

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