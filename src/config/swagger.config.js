const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUiExpress = require('swagger-ui-express');

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentacion del poder y del saber',
            description: 'API pensada para clase de Swagger'
        }
    },
    apis: ['src/docs/**/*.yaml']
}

const specs =  swaggerJsDoc(swaggerOptions);

module.exports = {specs, swaggerUiExpress};