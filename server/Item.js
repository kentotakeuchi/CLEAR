const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    userEmail: String,
    img: String,
    name: String,
    description: String,
    brand: String,
    ctg: String,
    cnd: String
});

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;