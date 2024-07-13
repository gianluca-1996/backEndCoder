const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const userDao = require('../daos/userDao.js');
const UserDto = require('../dtos/userDto.js');
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
            //esta dependencia se importa aca para no obtener error (cartService y userService se importan mutuamente)
            const cartService = require('../services/cartService.js');
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

    async getUserById(id){
        const user = await userDao.getUserById(id);
        if(!user) throw new Error("El id ingresado no corresponde a un usuario registrado");
        return new UserDto(user);
    }

    async login(email, password){
        const user = await userDao.getUserByEmail(email);
        if(!user){ throw new Error("Email no encontrado") };

        const matchPassword = await bcrypt.compare(password, user.password);
        if(!matchPassword) throw new Error("Contraseña incorrecta");

        //crea token
        const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn: '10m'});
        return token;
    }

    async getUserByCartId(cid){
        const user = await userDao.getUserByCartId(cid);
        if(!user) throw new Error("El cid ingresado no corresponde a un usuario registrado");
        return new UserDto(user);
    }
}

module.exports = new UserService();