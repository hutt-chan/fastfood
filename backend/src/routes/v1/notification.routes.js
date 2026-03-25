const router = require('express').Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const ctrl = require('../../controllers/notification/notification.controller');

router.use(authenticate);
router.get('/', ctrl.listNotifications);
router.post('/', authorize('admin'), ctrl.sendNotification);

module.exports = router;
