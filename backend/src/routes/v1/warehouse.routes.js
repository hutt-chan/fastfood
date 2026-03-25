const router = require('express').Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const ctrl = require('../../controllers/warehouse/warehouse.controller');

router.use(authenticate);
router.get('/inventory', authorize('warehouse','admin','branch_manager'), ctrl.getInventory);
router.post('/import', authorize('warehouse','admin'), ctrl.importStock);
router.get('/low-stock', authorize('warehouse','admin','branch_manager'), ctrl.lowStockReport);

module.exports = router;
