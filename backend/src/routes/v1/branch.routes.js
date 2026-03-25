const router = require('express').Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const ctrl = require('../../controllers/branch/branch.controller');

router.use(authenticate, authorize('branch_manager'));
router.get('/orders', ctrl.getOrderQueue);
router.patch('/orders/:id/assign-delivery', ctrl.assignDelivery);
router.patch('/orders/:id/status', ctrl.updateOrderStatus);
router.patch('/orders/:id/reject', ctrl.rejectOrder);

router.get('/menu', ctrl.getBranchMenu);
router.post('/menu', ctrl.addMenuItem);
router.put('/menu/:id', ctrl.updateMenuItem);
router.delete('/menu/:id', ctrl.deleteMenuItem);

router.get('/staff', ctrl.getDeliveryStaff);
router.post('/staff', ctrl.createStaff);
router.patch('/staff/:id', ctrl.updateStaff);
router.delete('/staff/:id', ctrl.disableStaff);

router.get('/revenue', ctrl.revenueReport);

module.exports = router;
