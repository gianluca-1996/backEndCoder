const productModel = require('../models/productModel.js');

class ProductDao{

    async addProduct(code, title, description, price, thumbnail, stock, category){
        return await productModel.create({
            code: code,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            stock: stock,
            category: category
        })
    };

    async getProductById(id){return await productModel.findById(id)};

    async getProducts(){ return await productModel.find() };

    async getProductsByFilters(category, options, stock ){ return await productModel.paginate( {$and: [category, stock]}, options ) };

    async updateProduct(id, filtro, session){ return await productModel.findOneAndUpdate({_id: id}, filtro)};

    async deleteProduct(id){ return await productModel.deleteOne({_id: id}) };
}

module.exports = new ProductDao();