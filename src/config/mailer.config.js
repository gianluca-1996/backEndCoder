const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASSWORD_EMAIL
    }
});

module.exports = transport;