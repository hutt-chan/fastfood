const router = require('express').Router();
const { authenticate } = require('../../middlewares/auth');
const ctrl = require('../../controllers/profile/profile.controller');

router.use(authenticate);
router.get('/', ctrl.getProfile);
router.put('/', ctrl.updateProfile);
router.get('/orders', ctrl.getOrderHistory);

module.exports = router;
