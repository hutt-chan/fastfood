const router = require('express').Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const ctrl = require('../../controllers/review/review.controller');

router.use(authenticate);
router.post('/', authorize('customer'), ctrl.createReview);
router.get('/order/:id', ctrl.getReviewsByOrder);
router.get('/product/:id', ctrl.getReviewsByProduct);

module.exports = router;
