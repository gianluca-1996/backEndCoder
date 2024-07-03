const mongoose = require('mongoose');
const cartCollection = "cart";
const cartSchema = new mongoose.Schema({ 
    products: [
        {
            pid: {type: mongoose.Schema.Types.ObjectId, ref:"product"},
            quantity: {type: Number, min: 0}
        }
    ] 
});

const cartModel = mongoose.model(cartCollection, cartSchema);

module.exports = cartModel;