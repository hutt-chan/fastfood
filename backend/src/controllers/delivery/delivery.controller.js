const orderService = require('../../services/order.service');
const { ok, fail } = require('../../utils/response');

const getAssignedOrders = async (req, res, next) => {
  try {
    const orders = await orderService.listOrders({ user_id: req.user.user_id, role: 'delivery' });
    ok(res, orders);
  } catch (err) { next(err); }
};

const acceptDelivery = async (req, res, next) => {
  try {
    const order_id = req.params.id;
    await orderService.updateOrderStatus({ order_id, new_status: 'delivering', changed_by: req.user.user_id });
    ok(res, null, 'Chấp nhận giao hàng thành công');
  } catch (err) { next(err); }
};

const updateDeliveryStatus = async (req, res, next) => {
  try {
    const order_id = req.params.id;
    const { status } = req.body;
    await orderService.updateOrderStatus({ order_id, new_status: status, changed_by: req.user.user_id });
    ok(res, null, 'Cập nhật trạng thái giao hàng thành công');
  } catch (err) { next(err); }
};

module.exports = { getAssignedOrders, acceptDelivery, updateDeliveryStatus };