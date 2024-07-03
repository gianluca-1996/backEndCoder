const express = require('express');
const cartController = require('../controllers/cartController.js');
const router = express.Router();

router.get('/', cartController.getCarts);
router.get('/:id', cartController.getCartById);
router.post('/', cartController.addCart);
router.post('/:cid/product/:pid', cartController.addProduct);
router.delete('/:cid/product/:pid', cartController.deleteProduct);
router.delete('/remove/:cid/product/:pid', cartController.removeUnitProduct);
router.delete('/deleteAll/:cid', cartController.deleteAllProducts);

module.exports = router;