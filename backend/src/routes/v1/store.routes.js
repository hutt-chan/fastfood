const router = require('express').Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const ctrl = require('../../controllers/store/store.controller');

router.get('/', ctrl.listStores);
router.get('/:id', ctrl.getStore);
router.post('/', authenticate, authorize('admin'), ctrl.createStore);
router.put('/:id', authenticate, authorize('admin'), ctrl.updateStore);
router.delete('/:id', authenticate, authorize('admin'), ctrl.deleteStore);

module.exports = router;
