const generateUserErrorInfo = (user) => {
    return `Una o mas propiedades estan incompletas o no son válidas
    Lista de propiedades requeridas para el usuario:
    *firstName: type: String, se recibió: ${user.firstName},
    *lastName: type: String, se recibió: ${user.lastName},
    *email: type: String, se recibió: ${user.email},
    *age: type: Number, se recibió: ${user.age},
    *role: type: String, se recibió: ${user.role},
    *password: type: String, se recibió: ${user.password}`;
}

module.exports = generateUserErrorInfo;