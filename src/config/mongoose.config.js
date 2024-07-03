const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@coderbackend.eme0pdu.mongodb.net/eCommerce?retryWrites=true&w=majority&appName=CoderBackEnd`)
.then(() => {console.log('Conectado a la base de datos')})
.catch(error => {console.log('Error al conectar a la base de datos: ' + error.message)});