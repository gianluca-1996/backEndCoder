const mongoose = require('mongoose');
const cartDao = require('../daos/cartDao.js');
const CartDto = require('../dtos/cartDto.js');
const productService = require('./productService.js');


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
    async addProduct(cid, pid){
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
        const cartUpdated = await cartDao.deleteProduct(cid, pid);
        if(!cartUpdated) throw new Error("El carrito no existe");
        return new CartDto(cartUpdated);
    }

    //ELIMINA TODOS LOS PRODUCTOS DEL CARRITO
    async deleteAllProducts(cid){
        const cartUpdated = await cartDao.deleteAllProducts(cid);
        if(!cartUpdated) throw new Error("El carrito no existe");
        return new CartDto(cartUpdated);
    }
}

module.exports = new CartService();