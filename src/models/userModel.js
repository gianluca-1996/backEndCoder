const mongoose = require('mongoose');
const userCollection = 'user';
const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    age: {type: Number, required: true},
    password: {type: String, required: true},
    role: {type: String, required: true},
    cart: {type: mongoose.Schema.Types.ObjectId, ref:"cart"},
    documents: [
        {name: {type: String}, reference: {type: String}}
    ],
    last_connection: {type: Date}
});

const userModel = mongoose.model(userCollection, userSchema);

module.exports = userModel;