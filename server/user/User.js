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

// UserSchema.statics.findByToken = function (token) {
//     const User = this;
//     let decoded;
//     try {
//         decoded = jwt.verify(token, config.secret);
//     } catch (err) {
//         return Promise.reject();
//     }
//     return User.findOne({
//         '_id': decoded._id,
//         'tokens.token': token,
//         'tokens.access': 'auth'
//     });
// };

const User = mongoose.model('User', UserSchema);

module.exports = User;