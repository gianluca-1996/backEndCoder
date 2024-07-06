const express = require('express');
const router = express();
const handlebars = require("express-handlebars");
router.engine("handlebars", handlebars.engine());
router.set("views", __dirname + "/../views");
router.set("view engine", "handlebars");
const {isNotAuthenticated, passportCall, authorization} = require('../middlewares/auth.js');
const viewsController = require('../controllers/viewsController.js');

router.get('/login', isNotAuthenticated, viewsController.login);
router.get('/register', isNotAuthenticated, viewsController.register);
router.get('/products', passportCall('jwt'), viewsController.products);
router.get('/cart/:cid', passportCall('jwt'), viewsController.cart);

module.exports = router;