const express = require('express');
const productController = require('../controllers/productController.js');
const router = express.Router();
const uploader = require("../utils.js");
const {passportCall} = require('../middlewares/auth.js');

router.get('/', passportCall('jwt'), productController.getProductsByFilters);
router.get('/:id', passportCall('jwt'), productController.getProductById);
router.post('/', passportCall('jwt'), uploader.single('file'), productController.addProduct);
router.put('/:id', passportCall('jwt'), productController.updateProduct);
router.delete('/:id', passportCall('jwt'), productController.deleteProduct);

module.exports = router;