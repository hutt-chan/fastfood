const router = require('express').Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const ctrl = require('../../controllers/branch/branch.controller');

router.use(authenticate, authorize('branch_manager'));
router.get('/orders', ctrl.getOrderQueue);
router.patch('/orders/:id/assign-delivery', ctrl.assignDelivery);
router.patch('/orders/:id/status', ctrl.updateOrderStatus);
router.get('/menu', ctrl.getBranchMenu);
router.get('/staff', ctrl.getDeliveryStaff);
router.get('/revenue', ctrl.revenueReport);

module.exports = router;
