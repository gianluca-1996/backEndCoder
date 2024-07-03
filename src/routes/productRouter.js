const express = require('express');
const productController = require('../controllers/productController.js');
const router = express.Router();
const uploader = require("../utils.js");

router.get('/', productController.getProductsByFilters);
router.get('/:id', productController.getProductById);
router.post('/', uploader.single('file'), productController.addProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;