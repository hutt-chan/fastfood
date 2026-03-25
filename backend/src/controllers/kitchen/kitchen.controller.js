const orderService = require('../../services/order.service');
const { ok, fail } = require('../../utils/response');

const getKitchenOrders = async (req, res, next) => {
  try {
    const store_id = req.user.store_id;
    const orders = await orderService.listOrders({ store_id, role: 'kitchen' });
    ok(res, orders);
  } catch (err) { next(err); }
};

const updateKitchenStatus = async (req, res, next) => {
  try {
    const order_id = req.params.id;
    const { status } = req.body;
    const result = await orderService.updateOrderStatus({ order_id, new_status: status, changed_by: req.user.user_id });
    ok(res, result, 'Cập nhật trạng thái bếp thành công');
  } catch (err) { next(err); }
};

module.exports = { getKitchenOrders, updateKitchenStatus };