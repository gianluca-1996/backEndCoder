const productsService = require('../services/productService.js');
const cartService = require('../services/cartService.js');

class ViewsController{

    login(req, res){ return res.render('login') };

    register(req, res){ return res.render('register') };

    async products(req, res){ 
        try {
            const {limit, sort, query, stock} = req.query;
            const data = await productsService.getProductsByFilters(req.query);
            res.render('products', {
                isAdmin: req.user.role == 'admin' ? true : false, //variable usada en main handlebars
                user: req.user,
                isLogUser: true,
                products: data.docs,
                filtros:{
                    limit: limit,
                    pizza: query === 'pizza' ? true : false,
                    empanada: query === 'empanada' ? true : false,
                    asc: sort == 'asc' ? true : false,
                    desc: sort == 'desc' ? true : false,
                    aplicaStock : stock === 'aplica' ? true: false,
                    noAplicaStock: stock === 'noAplica' ? true: false
                },
                page: data.page,
                hasPrevPage: data.hasPrevPage,
                hasNextPage: data.hasNextPage,
                prevPage: data.prevPage,
                nextPage: data.nextPage,
                prevLink: data.hasPrevPage ? `http://localhost:8080/views/products?limit=${data.limit}&page=${data.prevPage}&sort=${sort}&query=${query}&stock=${stock}` : null,
                nextLink: data.hasNextPage ? `http://localhost:8080/views/products?limit=${data.limit}&page=${data.nextPage}&sort=${sort}&query=${query}&stock=${stock}` : null
            });
        } catch (error) {
            res.send({result: "Error: " + error.message});
        }
    }

    async cart(req, res){
        try {
            const cart = await cartService.getCartById(req.params.cid);
            const products = cart.products;
            res.render('cart', {user: req.user, products: products, lenght: products.length > 0 ? true : false, isLogUser: true});
        } catch (error) {
            res.send({result: "Error: " + error.message});
        }
    }

    async successPurchase(req, res){
        try {
            res.render('successPurchase');
        } catch (error) {
            res.send({result: "Error: " + error.message});
        }
    }

    async sendEmailChangePassword(req, res){
        try {
            res.render('sendEmailChangePassword');
        } catch (error) {
            res.send({result: "Error: " + error.message});
        }
    }

    async changePassword(req, res){
        try {
            res.render('changePassword', {id: req.params.id});
        } catch (error) {
            res.send({result: "Error: " + error.message});
        }
    }

    async sentEmail(req, res){
        try {
            res.render('sentEmail');
        } catch (error) {
            res.send({result: "Error: " + error.message});
        }
    }
}

module.exports = new ViewsController();