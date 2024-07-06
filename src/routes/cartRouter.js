const Router = require('express')
const router = Router();
const cartController = require('../controllers/cartController.js');
const {passportCall, authorization} = require('../middlewares/auth.js');

router.get('/', passportCall('jwt'), cartController.getCarts);
router.get('/:id', passportCall('jwt'), cartController.getCartById);
router.post('/', passportCall('jwt'), authorization(['admin']), cartController.addCart);
router.post('/:cid/product/:pid', passportCall('jwt'), cartController.addProduct);
router.delete('/:cid/product/:pid', passportCall('jwt'), cartController.deleteProduct);
//router.delete('/remove/:cid/product/:pid', passportCall('jwt'), cartController.removeUnitProduct);
//router.delete('/deleteAll/:cid', passportCall('jwt'), cartController.deleteAllProducts);

module.exports = router;