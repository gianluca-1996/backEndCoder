const express = require('express');
const userController = require('../controllers/userController.js');
const router = express.Router();
const {isNotAuthenticated, passportCall} = require('../middlewares/auth.js');

router.get('/:id', passportCall('jwt'), userController.getUserById);
router.post('/register', isNotAuthenticated, userController.createUser);
router.post('/login', isNotAuthenticated, userController.login);
router.post('/logout', userController.logout);

module.exports = router;