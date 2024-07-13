const Router = require('express')
const router = Router();
const cartController = require('../controllers/cartController.js');
const {passportCall, authorization} = require('../middlewares/auth.js');

router.get('/', passportCall('jwt'), cartController.getCarts);
router.get('/:id', passportCall('jwt'), cartController.getCartById);
router.post('/', passportCall('jwt'), cartController.addCart);
router.post('/:cid/product/:pid', passportCall('jwt'), cartController.addProduct);
router.delete('/:cid/product/:pid', passportCall('jwt'), cartController.deleteProduct);
router.post('/purchase', passportCall('jwt'), cartController.saveTicket);
router.post('/cleanCart', passportCall('jwt'), cartController.cleanCart);

module.exports = router;