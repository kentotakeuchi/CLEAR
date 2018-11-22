const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    userID: String,
    userName: String,
    userEmail: String,
    img: String,
    name: String,
    desc: String,
    brand: String,
    ctg: String,
    cnd: String
});

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;