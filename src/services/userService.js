const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const userDao = require('../daos/userDao.js');
const UserDto = require('../dtos/userDto.js');
const bcrypt = require('bcrypt');
const transport = require('../config/mailer.config.js');
const CustomError = require('./errors/customError.js');
const EErrors = require('./errors/enum.js');
const generateUserErrorInfo = require('./errors/info.js');

class UserService{
    async createUser(body){
        const {firstName, lastName, email, age, role, password} = body;

        if(!firstName || !lastName || !email || !age || !role || !password){
            CustomError.createError({                
                name: "Error al crear el usuario", 
                cause: generateUserErrorInfo({firstName, lastName, email, age, role, password}),
                message: "Error durante la creacion del usuario",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }

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

    async updatePassword(id, password){
        const user = await userDao.getUserById(id);
        const passEncrypted = await bcrypt.hash(password, 2);
        const updatePassUserOk = await userDao.updatePassword(user.email, passEncrypted);
        if(!updatePassUserOk.acknowledged) throw new Error("No se ha podido acualizar la contraseña");
    }

    async sendEmailChangePassword(email){
        const user = await userDao.getUserByEmail(email);
        const url = `http://localhost:8080/views/changePassword/${user._id}`;
        await transport.sendMail({
            from: `Gian Ecommerce ${process.env.EMAIL}`,
            to: email,
            subject: 'CAMBIO DE CONTRASEÑA',
            html: 
                `<div> 
                    <h1>Hola, con el siguiente enlace podrás cambiar tu contraseña</h1>
                    <a href="${url}" style="display: inline-block; margin: 20px 0; padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
                </div>`,
            attachments: []
        });
    }

    async uploadDocuments(uid, documents){
        const docs = [];
        documents.forEach(e => {
            docs.push({name: e.filename, reference: e.destination});
        });
        const upload = await userDao.uploadDocuments(uid, docs);
        if(!upload.modifiedCount) throw new Error("No se pudo actualizar los documentos");
        return upload;
    }

    async uploadRoleToAdmin(id){
        const user = await userDao.getUserById(id);
        if(user.role === 'admin') throw Error("El usuario ya posee el rol admin");
        if(!user.documents || user.documents.length < 3) throw Error("No posee los documentos suficientes para ser Administrador. Actualice sus documentos e intentelo nuevamente");
        const upload = await userDao.uploadRoleToAdmin(id);
        if(!upload.modifiedCount) throw Error("No se pudo actualizar el rol");
        return upload;  
    }
}

module.exports = new UserService();