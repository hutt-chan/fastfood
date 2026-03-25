const router = require('express').Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const ctrl = require('../../controllers/cart/cart.controller');

router.use(authenticate, authorize('customer'));
router.get('/', ctrl.getCart);
router.post('/add', ctrl.addItem);
router.patch('/item/:product_id', ctrl.updateItem);
router.delete('/item/:product_id', ctrl.removeItem);
router.delete('/clear', ctrl.clearCart);

module.exports = router;
