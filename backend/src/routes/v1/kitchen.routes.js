const router = require('express').Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const ctrl = require('../../controllers/kitchen/kitchen.controller');

router.use(authenticate, authorize('kitchen'));
router.get('/orders', ctrl.getKitchenOrders);
router.patch('/orders/:id/status', ctrl.updateKitchenStatus);

module.exports = router;
