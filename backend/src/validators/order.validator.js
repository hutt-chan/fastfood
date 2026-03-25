const { body } = require('express-validator');

const placeOrderRules = [
  body('store_id').isInt({ min: 1 }).withMessage('Chi nhánh không hợp lệ'),
  body('delivery_address_id').isInt({ min: 1 }).withMessage('Địa chỉ giao hàng không hợp lệ'),
];

module.exports = { placeOrderRules };
