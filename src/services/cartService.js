const mongoose = require('mongoose');
const transport = require('../config/mailer.config.js');
const cartDao = require('../daos/cartDao.js');
const CartDto = require('../dtos/cartDto.js');
const productService = require('./productService.js');
const userService = require('./userService.js');
const ticketService = require('./ticketService.js');


class CartService{
    async getCarts(){
        const carts = await cartDao.getCarts();
        return carts.map(cart => new CartDto(cart));
    }

    async getCartById(id){
        const cart = await cartDao.getCartById(id);
        return new CartDto(cart);
    }

    async addCart(session){ return await cartDao.addCart(session) }

    /**
     * SI EL PRODUCTO NO SE ENCUENTRA EN EL CARRITO SE INSERTA CON QUANTITY 1
     * CASO CONTRARIO SE ACTUALIZA LA PROPIEDAD QUENTITY EN +1 PARA EL PRODUCTO SELECCIONADO
     * TAMBIEN ES ACTUALIZADO EL STOCK DEL PRODUCTO SEGUN CORRESPONDA.
     * LA OPERACION DEBE SUCEDER POR COMPLETO O NO SUCEDER PARA MANTENER LA
     * CONSISTENCIA DE LA DB DE MANERA CORRECTA
     */
    async addProduct(cid, pid, uid){
        const user = await userService.getUserById(uid);
        if(user.cart._id != cid) throw new Error("No tiene permisos para agregar productos a este carrito");

        const productToAdd = await productService.getProductById(pid);
        if(!productToAdd) throw new Error("El producto especificado no existe");
        if(productToAdd.stock === 0) throw new Error("El producto especificado no posee stock");

        let cart = await cartDao.getCartById(cid);
        const productInCart = cart.products.find(product => product.pid._id == pid);
        const session = await mongoose.startSession();

        if(productInCart){
            const quantity = productInCart.quantity;
            //inicia la transaccion
            session.startTransaction();

            try {
                cart = await cartDao.updateProduct(cid, pid, quantity + 1, session);
                await productService.updateProduct(pid, {campo: "stock", valor: productToAdd.stock - 1}, session);
                //Confirma la transacción
                await session.commitTransaction();
            } catch (error) {
                // Si hay algún error, se hace rollback de la transacción
                await session.abortTransaction();
                throw new Error('La transacción falló y se ha revertido.');
            }finally {
                // Finaliza la sesión
                session.endSession();
            }
        }
        else{
            try {
                //inicia la transaccion
                session.startTransaction();
                cart = await cartDao.addProduct(cid, pid, session);
                await productService.updateProduct(pid, {campo: "stock", valor: productToAdd.stock - 1}, session);
                //Confirma la transacción
                await session.commitTransaction();
            } catch (error) {
                // Si hay algún error, se hace rollback de la transacción
                await session.abortTransaction();
                throw new Error('La transacción falló y se ha revertido.');
            }finally {
                // Finaliza la sesión
                session.endSession();
            }
        }

        return new CartDto(cart);
    }

    /**
     * ELIMINA EN UNA UNIDAD EL PRODUCTO SELECCIONADO EN CASO DE ENCONTRARSE DENTRO DEL CARRITO     
     * SE ASEGURA DE QUE SUCEDA LA OPERACION POR COMPLETO O NO SUCEDA EN ABSOLUTO PARA MANTENER
     * LA CONSISTENCIA DE LA DB
     */
    async removeUnitProduct(cid, pid){
        const productToRemove = await productService.getProductById(pid);
        if(!productToRemove) throw new Error("El producto especificado no existe");

        let cart = await cartDao.getCartById(cid);
        const productInCart = cart.products.find(product => product.pid._id == pid);

        if(!productInCart) throw new Error("El producto especificado no existe en el carrito");

        const session = await mongoose.startSession();
        //inicia la transaccion
        session.startTransaction();

        try {
            cart = await cartDao.updateProduct(cid, pid, productInCart.quantity - 1, session);
            await productService.updateProduct(pid, {campo: "stock", valor: productToRemove.stock + 1}, session);
            //Confirma la transacción
            await session.commitTransaction();
        } catch (error) {
            // Si hay algún error, se hace rollback de la transacción
            await session.abortTransaction();
            throw new Error('La transacción falló y se ha revertido.');
        }finally {
            // Finaliza la sesión
            session.endSession();
        }

        return new CartDto(cart);
    }

    //ELIMINA TODAS LAS UNIDADES DEL PRODUCTO EN EL CARRITO
    async deleteProduct(cid, pid){
        const cart = await cartDao.getCartById(cid);
        if(!cart) throw new Error("El carrito no existe para este usuario");
        const product = await productService.getProductById(pid);
        const quantity = cart.products.find(prod => prod.pid._id == pid).quantity;
        await cartDao.deleteProduct(cid, pid);
        await productService.updateProduct(pid, {campo: "stock", valor: product.stock + quantity});
    }

    //CONFIRMAR LA COMPRA - GENERACION DEL TICKET
    async saveTicket(cid){
        const cart = await cartDao.getCartById(cid);
        const products = cart.products;
        if(products.length == 0) throw new Error("Debe agregar productos al carrito");
        const user = await userService.getUserByCartId(cid);
        let amount = 0;
        let detail = [];

        products.forEach(product => { 
            amount += product.pid.price * product.quantity;
            detail.push({
                title: product.pid.title, 
                quantity: product.quantity, 
                priceUnit: product.pid.price,
                subTotal: product.pid.price * product.quantity
            })
        } );
        
        const session = await mongoose.startSession();
        try {
            
            //INICIO TRANSACCION
            session.startTransaction();
            const ticket = await ticketService.saveTicket(new Date(), amount, user.email, detail, session);
            //vaciar el carrito luego de confirmar la compra
            await cartDao.deleteAllProducts(cid, session);
            let ticketDetailHtml = '';
            ticket.detail.forEach(item => {
                ticketDetailHtml += 
                `<p><strong>Title:</strong> ${item.title}</p>
                <p><strong>Quantity:</strong> ${item.quantity}</p>
                <p><strong>PriceUnit:</strong> $${item.priceUnit}</p>
                <p><strong>SubTotal:</strong> $${item.subTotal}</p>`;
            });
            await transport.sendMail({
                from: `Gian Ecommerce ${process.env.EMAIL}`,
                to: 'gianluca.cambareri@outlook.com',
                subject: 'TICKET DE COMPRA',
                html: 
                    `<div> <h1>Hola, tu compra se ha realizado con éxito!</h1>
                        <h2>Tu código es ${ticket.code}</h2>
                        <p>En este ticket podrás encontrar el detalle de tu compra</p>
                        <h4>Purchaser: ${ticket.purchaser}</h4>
                        <h4>PurchaseDt: ${ticket.purchaseDt}</h4>
                        <h3>Detail:</h3>
                        ${ticketDetailHtml}
                        <h3><strong>Amount:</strong> $${ticket.amount}</h3>
                    </div>`,
                attachments: []
            });
            //Confirma la transacción
            await session.commitTransaction();
        } catch (error) {
            // Si hay algún error, se hace rollback de la transacción
            await session.abortTransaction();
            throw new Error('La compra falló y se ha revertido. Intente nuevamente');
        }finally {
            // Finaliza la sesión
            session.endSession();
        }
    }

    /**ESTE METODO LIMPIA EL CARRITO EN CASO QUE EL USUARIO CIERRE LA SESION O CANCELE LA COMPRA
     * ELIMINA LOS PRODUCTOS DEL CARRITO Y ACTUALIZA SU STOCK A SU ESTADO PREVIO
     */
    async cleanCart(cid){
        const session = await mongoose.startSession();
        try {
            const cart = await cartDao.getCartById(cid);
            const products = cart.products;
            if(products.length == 0){
                return;
            }

            //INICIO TRANSACCION
            session.startTransaction();

            products.forEach(async (product) => {
                await productService.updateProduct(product.pid._id, {campo: "stock", valor: product.pid.stock + product.quantity}, session);
            });
            await cartDao.deleteAllProducts(cid, session);
            //Confirma la transacción
            await session.commitTransaction();
        } catch (error) {
            // Si hay algún error, se hace rollback de la transacción
            await session.abortTransaction();
            throw new Error('Fallo cleanCart');
        }finally {
            // Finaliza la sesión
            session.endSession();
        }
    }
}

module.exports = new CartService();