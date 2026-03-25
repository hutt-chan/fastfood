const router = require('express').Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const ctrl = require('../../controllers/delivery/delivery.controller');

router.use(authenticate, authorize('delivery'));
router.get('/assigned', ctrl.getAssignedOrders);
router.patch('/assigned/:id/accept', ctrl.acceptDelivery);
router.patch('/assigned/:id/status', ctrl.updateDeliveryStatus);

module.exports = router;
