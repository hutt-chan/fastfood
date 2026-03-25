const router = require('express').Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const ctrl = require('../../controllers/order/order.controller');

router.use(authenticate);
router.get('/', ctrl.getMyOrders);
router.get('/:id', ctrl.getOrder);
router.post('/', authorize('customer'), ctrl.placeOrder);
router.patch('/:id/cancel', authorize('customer'), ctrl.cancelOrder);
router.patch('/:id/status', authorize('admin','branch_manager','kitchen','delivery'), ctrl.updateStatus);
router.patch('/:id/assign-delivery', authorize('branch_manager'), ctrl.assignDelivery);

module.exports = router;
