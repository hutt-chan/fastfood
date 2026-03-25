const router = require('express').Router();
const { authenticate } = require('../../middlewares/auth');
const ctrl = require('../../controllers/payment/payment.controller');

router.use(authenticate);
router.post('/order/:id/method', ctrl.choosePaymentMethod);
router.get('/vnpay/callback', ctrl.vnpayCallback);

module.exports = router;
