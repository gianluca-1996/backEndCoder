const express = require('express');
const userController = require('../controllers/userController.js');
const router = express.Router();
const {isNotAuthenticated, passportCall} = require('../middlewares/auth.js');
const {uploader} = require("../utils.js");

router.get('/:id', passportCall('jwt'), userController.getUserById);
router.post('/register', isNotAuthenticated, userController.createUser);
router.post('/login', isNotAuthenticated, userController.login);
router.post('/logout', passportCall('jwt'), userController.logout);
router.post('/changePassword/:id', userController.updatePassword);
router.post('/sendEmailChangePassword', userController.sendEmailChangePassword);
router.post('/:uid/documents', uploader.array('documents', 3), userController.uploadDocuments);
router.get('/premium/:uid', userController.uploadRoleToAdmin);

module.exports = router;