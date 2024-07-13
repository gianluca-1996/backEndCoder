const cartService = require('../services/cartService.js');

class CartController{
    async getCarts(req, res){
        try {
            const carts = await cartService.getCarts();
            res.json( {result: 'success', payload: carts} );
        } catch (error) {
            res.status(400).json( {result: 'error', error: error.message} );
        }
    }

    async getCartById(req, res){
        try {
            const cart = await cartService.getCartById(req.params.id);
            res.json( {result: 'success', payload: cart} );
        } catch (error) {
            res.status(400).json( {result: 'error', error: error.message} );
        }
    }

    async addCart(req, res){
        try {
            const cart = await cartService.addCart();
            res.json( {result:'success', payload: cart} );
        } catch (error) {
            res.status(500).json( {result: 'error', error: error.message} );
        }
    }

    async addProduct(req, res){
        try {
            const cart = await cartService.addProduct(req.params.cid, req.params.pid, req.user._id);
            res.json( {result:'success', payload: cart} );
        } catch (error) {
            res.json( {result: 'error', error: error.message} );
        }
    }

    async removeUnitProduct(req, res){
        try {
            const cart = await cartService.removeUnitProduct(req.params.cid, req.params.pid);
            res.json( {result:'success', payload: cart} );
        } catch (error) {
            res.status(500).json( {result: 'error', error: error.message} );
        }
    }

    async deleteProduct(req, res){
        try {
            await cartService.deleteProduct(req.params.cid, req.params.pid);
            res.json({result:'success'});
        } catch (error) {
            res.status(500).json( {result: 'error', error: error.message} );
        }
    }

    async saveTicket(req, res){
        try {
            await cartService.saveTicket(req.user.cart);
            res.redirect('/views/successPurchase');
        } catch (error) {
            res.status(400).json( {result: 'error', error: error.message} );
        }
    }

    async cleanCart(req, res){
        try {
            await cartService.cleanCart(req.user.cart);
            res.redirect('/views/products');
        } catch (error) {
            res.status(400).json( {result: 'error', error: error.message} );
        }
    }
}

module.exports = new CartController();