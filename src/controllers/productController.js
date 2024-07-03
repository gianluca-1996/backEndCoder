const productService = require('../services/productService.js');

class ProductController{
    async addProduct(req, res){
        try {
            const productDto = await productService.addProduct(req.body, req.file);
            res.status(201).json( {result: 'success', payload: productDto} );
        } catch (error) {
            res.status(400).json( {result: 'error', error: error.message} );
        }
    }

    async getProductById(req, res){
        try {
            const productDto = await productService.getProductById(req.params.id);
            res.json( {result: 'success', payload: productDto} );
        } catch (error) {
            res.status(400).json( {result: 'error', error: error.message} );
        }
    }

    async getProducts(req, res){
        try {
            const products = await productService.getProducts();
            res.json({ result: 'success', payload: products} );
        } catch (error) {
            res.status(400).json( {result: 'error', error: error.message} );
        }
    }

    async getProductsByFilters(req, res){
        try {
            const products = await productService.getProductsByFilters(req.query);
            res.json( {result: 'success', payload: products} );
        } catch (error) {
            res.status(400).json( {result: 'error', error: error.message} );
        }
    }

    async updateProduct(req, res){
        try {
            await productService.updateProduct(req.params.id, req.body);
            res.json( {result: 'success'} );
        } catch (error) {
            res.status(400).json( {result: 'error', error: error.message} );
        }
    }

    async deleteProduct(req, res){
        try {
            await productService.deleteProduct(req.params.id);
            res.json( {result: 'success'} );
        } catch (error) {
            res.status(400).json( {result: 'error', error: error.message} );
        }
    }
}

module.exports = new ProductController();