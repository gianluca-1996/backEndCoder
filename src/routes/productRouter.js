const express = require('express');
const productController = require('../controllers/productController.js');
const router = express.Router();
const {uploader} = require("../utils.js");
const {passportCall, authorization} = require('../middlewares/auth.js');

router.get('/', passportCall('jwt'), productController.getProductsByFilters);
router.get('/:id', passportCall('jwt'), productController.getProductById);
router.post('/', passportCall('jwt'), authorization(['admin']), uploader.single('file'), productController.addProduct);
router.put('/:id', passportCall('jwt'), authorization(['admin']), productController.updateProduct);
router.delete('/:id', passportCall('jwt'), authorization(['admin']), productController.deleteProduct);
router.get('/mocking/get', productController.mockingProducts);

module.exports = router;