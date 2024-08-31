const multer = require('multer');
const { faker } = require('@faker-js/faker');
const winston = require('winston');
const program = require('./config/programArgs.config.js');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        //cb(null, __dirname + '/public/img');
        console.log(file);
        cb(null, __dirname + '/documents');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
})

const uploader = multer({storage});


const generateProducts = () => {
    return {
        code: "codigoTest123",
        title: faker.lorem.sentence({ min: 3, max: 5 }),
        price: faker.number.float({ multipleOf: 0.25, min: 1, max:100 }),
        thumbnail: faker.system.directoryPath() + "/" + faker.system.fileName(),
        stock: faker.number.int({max: 100}),
        category: faker.word.sample(),
        status: faker.datatype.boolean()
    }
}

const customLevelOptions = {
    levels:{
        fatal: 0,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors:{
        fatal: 'red',
        warning: 'yellow',
        info: 'blue',
        http: 'green',
        debug: 'white'
    }
}

const logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        program.args[0] === 'prod' ?
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOptions.colors}),
                winston.format.simple()
            )
        })
     :
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: __dirname + '/logErrors/errores.log',
            level: 'fatal'
        })
    ]
    
})


module.exports = {uploader, generateProducts, logger};