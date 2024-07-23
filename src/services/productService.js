const productDao = require('../daos/productDao.js');
const ProductDto = require('../dtos/productDto.js');

class ProductService{
    async addProduct(body, file){
        const {code, title, description, price, stock, category} = body;
        if(!code || !title || !description || !price || !stock || !category)
            throw new Error("Debe completar los datos del producto");
        if(isNaN(price))
            throw new Error("El campo price debe ser un valor correcto");
        const thumbnail = file && file.filename;
        const product = await productDao.addProduct(code, title, description, price, thumbnail, stock, category);
        return new ProductDto(product);
    };

    async getProductById(id){
        if(!id) throw new Error("Debe introducir un id");
        const product = await productDao.getProductById(id);
        if(!product)
            throw new Error("El producto especificado no existe");
        return new ProductDto(product);
    };

    async getProducts(){
        const products = await productDao.getProducts();
        return products.map(product => new ProductDto(product));
    };

    async getProductsByFilters(reqQuery){
        const {limit, page, sort, query, stock} = reqQuery;
        const quantityDocs = (isNaN(limit) || !limit) ? 10 : parseInt(limit);
        const pagesDocs = (isNaN(page) || !page) ? 1 : parseInt(page);
        let sortDocs = {};
        let stockObj = {};
        let category = query ? {category: query} : {};

        switch(sort){
            case 'asc':{
                sortDocs = {price: 1};
                break;
            }

            case 'desc':{
                sortDocs = {price: -1}
                break;
            }
        };

        switch(stock){
            case 'aplica':{
                stockObj = {stock: { $gt: 0 }};
                break;
            }

            case 'noAplica':{
                stockObj = {stock: { $eq: 0 }};
                break;
            }
        };

        const options = {
            limit: quantityDocs,
            page: pagesDocs,
            sort: sortDocs
        }
        
        return await productDao.getProductsByFilters(category, options, stockObj);
    };

    async updateProduct(id, body){
        const {campo, valor, obj} = body;

        if(campo && valor === undefined)
            throw new Error("Debe ingresar el nuevo valor");

        let filtro = {};

        switch (campo) {
            case "title":{
                filtro = {$set: {title: valor}};
                break;
            }
      
            case "description":{
                filtro = {$set: {description: valor}};
                break;
            }
      
            case "price":{
                filtro = {$set: {price: valor}};
                break;
            }
      
            case "thumbnail":{
                filtro = {$set: {thumbnail: valor}};
                break;
            }
      
            case "code":{
                filtro = {$set: {code: valor}};
                break;
            }
      
            case "stock":{
                filtro = {$set: {stock: valor}};
                break;
            }

            case "category":{
                filtro = {$set: {category: valor}};
                break;
            }
      
            case undefined:{
                filtro = {...obj};
                break;
            }
        }

        const response = await productDao.updateProduct(id, filtro);
        if(response.modifiedCount === 0) throw new Error("El producto a actualizar no existe");
        return;
    }

    async deleteProduct(id){ 
        const deletedProduct = await productDao.deleteProduct(id);
        if(deletedProduct.deletedCount != 1) throw new Error("El producto a eliminar no existe");
        return;
    };
}

module.exports = new ProductService();