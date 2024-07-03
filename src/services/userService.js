const mongoose = require('mongoose');
const userDao = require('../daos/userDao.js');
const UserDto = require('../dtos/userDto.js');
const cartService = require('../services/cartService.js');
const bcrypt = require('bcrypt');

class UserService{
    async createUser(body){
        const {firstName, lastName, email, age, role, password} = body;
        if(await userDao.getUserByEmail(email)) throw new Error("Ya existe un usuario con el email ingresado");

        const passEncrypted = await bcrypt.hash(password, 2);
        const newUser = {
            firstName,
            lastName,
            email,
            age,
            role,
            password: passEncrypted
        }

        const session = await mongoose.startSession();
        //inicia la transaccion
        session.startTransaction();
        try {
            const newCart = await cartService.addCart(session);
            newUser.cart = newCart._id;
            const user = await userDao.createUser(newUser, session);
            if(!user) throw new Error("Error al crear el usuario");
            //Confirma la transacción
            await session.commitTransaction();
            
            return new UserDto(user);
        } catch (error) {
            // Si hay algún error, se hace rollback de la transacción
            await session.abortTransaction();
            throw new Error('La transacción de crear usuario falló y se ha revertido.');
        }finally {
            // Finaliza la sesión
            session.endSession();
        }
    }
}

module.exports = new UserService();