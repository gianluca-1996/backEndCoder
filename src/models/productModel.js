const mongoose = require('mongoose');
const productCollection = 'product';
const mongoosePaginate = require('mongoose-paginate-v2');
const productSchema = new mongoose.Schema({
    code: {type: String, required: true, unique: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    thumbnail: {type: Array, required: true},
    stock: {type: Number, required: true},
    category: {type: String, required: true},
    status: {type: Boolean, default: true}
})

productSchema.pre('find', function(){
    this.lean();
})
productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model(productCollection, productSchema);

module.exports = productModel;