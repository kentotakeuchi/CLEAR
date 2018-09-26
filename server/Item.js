const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    userEmail: String,
    name: String,
    description: String
});

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;