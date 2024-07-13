const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const ticketCollection = 'ticket';
const ticketSchema = new mongoose.Schema({
    code: {type: String, required: true, unique: true, default: generateUniqueCode},
    purchaseDt: {type: Date, required: true},
    amount: {type: Number, required: true},
    purchaser: {type: String, required: true},
    detail: [{title: String, quantity: Number, priceUnit: Number, subTotal: Number}]
})

// Función para generar el código único
function generateUniqueCode() {
    return Math.random().toString(36).substring(2, 9).toUpperCase();
}

ticketSchema.plugin(uniqueValidator);
const ticketModel = mongoose.model(ticketCollection, ticketSchema);

module.exports = ticketModel;