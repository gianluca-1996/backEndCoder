const cartService = require('../services/cartService.js');
const userService = require('../services/userService.js');
const jwt = require('jsonwebtoken');

class UserController{

    /**Al ingresar en la app, el usuario tiene un tiempo maximo de 5 min para realizar la compra.
     * Esta lógica se implementa para evitar que un usuario olvide realizar su compra o que
     * pueda "reservar" los productos dentro del carrito.
     */
    async login(req, res){
        try {
            const token = await userService.login(req.body.email, req.body.password);
            const userDecoded = jwt.verify(token, process.env.JWT_SECRET);
            /**Con setInterval se limpia automaticamente el carrito del usuario cada 5 minutos haciendo que
             * la cantidad de productos seleccionados este disponible para el resto de usuarios
             * en caso de olvidar confirmar su compra.
            */
            const intervalId = setInterval(async () => {
                await cartService.cleanCart(userDecoded.cart);
            }, 300000); //5min

            //Detiene el vaciado automatico del carrito una vez que el tiempo de sesion ha expirado (10 min max de sesion)
            setTimeout(() => {
                clearInterval(intervalId);
            }, 600000);

            res.cookie(process.env.COOKIE_SECRET, token, {maxAge: 600000, httpOnly: true} ) //10min max de sesion
            .redirect('/views/products');
        } catch (error) {
            res.status(400).json( {result: 'error', error: error.message} );
        }
    }

    async logout(req, res){
        try {
            //ANTES DE CERRAR LA SESION, LIMPIO EL CARRITO DEL USUARIO DE SER NECESARIO
            await cartService.cleanCart(req.user.cart);
            return res.cookie('coderCookieToken', '', { expires: new Date(0), httpOnly: true }).redirect('/views/login');
        } catch (error) {
            res.status(400).json( {result: 'error', error: error.message} );
        }
    }

    async createUser(req, res){
        try {
            const user = await userService.createUser(req.body);
            res.status(201).json( {result: "success", payload: user} );
        } catch (error) {
            res.status(400).json( {
                result: 'error', error: {
                    name: error.name,
                    cause: error.cause,
                    message: error.message,
                    code: error.code
                }} );
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

    async updatePassword(req, res){
        try {
            await userService.updatePassword(req.params.id, req.body.password);
            res.redirect('/views/login');
        } catch (error) {
            res.status(400).json( {result: 'error', error: error.message} );
        }
    }

    async sendEmailChangePassword(req, res){
        try {
            await userService.sendEmailChangePassword(req.body.email);
            res.redirect('/views/sentEmail');
        } catch (error) {
            res.status(400).json( {result: 'error', error: error.message} );
        }
    }

    async uploadDocuments(req, res){
        try {
            const upload = await userService.uploadDocuments(req.params.uid, req.files);
            res.json({result: 'success', payload: upload});
        } catch (error) {
            res.status(400).json( {result: 'error', error: error.message} );
        }
    }

    async uploadRoleToAdmin(req, res){
        try {
            const upload = await userService.uploadRoleToAdmin(req.params.uid);
            res.json({result: 'success', payload: upload});
        } catch (error) {
            res.status(400).json( {result: 'error', error: error.message} );
        }
    }
}

module.exports = new UserController();