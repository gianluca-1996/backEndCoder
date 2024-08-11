const express = require('express');
const handlebars = require("express-handlebars");
const handlebarsHelpers = require('handlebars-helpers');
const router = express();

// Configuracion el motor de plantillas Handlebars
const hbs = handlebars.create({
    extname: '.handlebars',
    defaultLayout: 'main',
    helpers: handlebarsHelpers() // Registrar los helpers
});

router.engine('handlebars', hbs.engine);
router.set("views", __dirname + "/../views");
router.set('view engine', 'handlebars');

const {isNotAuthenticated, passportCall, authorization} = require('../middlewares/auth.js');
const viewsController = require('../controllers/viewsController.js');

router.get('/login', isNotAuthenticated, viewsController.login);
router.get('/register', isNotAuthenticated, viewsController.register);
router.get('/products', passportCall('jwt'), viewsController.products);
router.get('/cart/:cid', passportCall('jwt'), viewsController.cart);
router.get('/successPurchase', passportCall('jwt'), viewsController.successPurchase);
router.get('/sendEmailChangePassword', viewsController.sendEmailChangePassword);
router.get('/changePassword/:id', viewsController.changePassword);
router.get('/sentEmail', viewsController.sentEmail);

module.exports = router;