const router = require('express').Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const ctrl = require('../../controllers/admin/admin.controller');

router.use(authenticate, authorize('admin'));
router.get('/users', ctrl.listUsers);
router.patch('/users/:user_id', ctrl.updateUserStatus);
router.get('/config', ctrl.systemConfig);
router.patch('/config', ctrl.updateSystemConfig);

module.exports = router;
