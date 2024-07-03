const cartModel = require('../models/cartModel.js');

class CartDao{

    async addCart(session){ 
        const cart = new cartModel({});
        return await cart.save(session && { session: session });
    };

    async getCarts(){ return await cartModel.find() };

    async getCartById(id){ return await cartModel.findById(id).lean().populate('products.pid') };
    
    // SE USA PARA AGREGAR UN PRODUCTO POR PRIMERA VEZ AL CARRITO
    async addProduct(cid, pid, session){ 
        return await cartModel.findByIdAndUpdate(
            { _id: cid },
            { $push: {products: { pid: pid, quantity: 1 } } },
            { session }
        );
    };

    //SE USA PARA AGREGAR O REMOVER UN PRODUCTO
    async updateProduct(cid, pid, quantity, session){ 
        return await cartModel.findOneAndUpdate(
            { _id: cid, "products.pid": pid },
            { $set: { "products.$.quantity" : quantity} },
            { session }
        );
    };

    async deleteProduct(cid, pid){ return await cartModel.findOneAndUpdate( { _id: cid }, { $pull: { products: {pid: pid} } } ) };

    async deleteAllProducts(cid){ return await cartModel.findOneAndUpdate( { _id: cid }, { $set: { products: [] } } ) };
}

module.exports = new CartDao();