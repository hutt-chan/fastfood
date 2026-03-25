const router = require('express').Router();
const ctrl = require('../../controllers/menu/menu.controller');

router.get('/', ctrl.listMenu);
router.get('/categories', ctrl.getCategories);
router.get('/products', ctrl.getProducts);
router.get('/search', ctrl.searchMenu);
router.get('/:id', ctrl.getItem);

module.exports = router;
