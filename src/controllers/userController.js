const cartService = require('../services/cartService.js');
const userService = require('../services/userService.js');

class UserController{
    async createUser(req, res){
        try {
            const user = await userService.createUser(req.body);
            res.status(201).json( {result: "success", payload: user} );
        } catch (error) {
            res.status(400).json( {result: 'error', error: error.message} );
        }
    }

    async getUserById(req, res){
        try {
            const user = await userService.getUserById(req.params.id);
            res.json( {result: "success", payload: user} );
        } catch (error) {
            res.status(400).json( {result: 'error', error: error.message} );
        }
    }

    async login(req, res){
        try {
            const token = await userService.login(req.body.email, req.body.password);
            res.cookie(process.env.COOKIE_SECRET, token, {maxAge: 60 * 60 * 10000, httpOnly: true} )
            .redirect('/views/products');
        } catch (error) {
            res.status(400).json( {result: 'error', error: error.message} );
        }
    }

    async logout(req, res){
        try {
            //ANTES DE CERRAR LA SESION, LIMPIO EL CARRITO DEL USUARIO DE SER NECESARIO
            await cartService.cleanCart(req.user.cart);
            res.cookie('coderCookieToken', '', { expires: new Date(0), httpOnly: true }).redirect('/views/login');
        } catch (error) {
            res.status(400).json( {result: 'error', error: error.message} );
        }
    }
}

module.exports = new UserController();