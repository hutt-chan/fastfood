const orderService = require('../../services/order.service');
const notificationService = require('../../services/notification.service');
const { ok, fail } = require('../../utils/response');

const placeOrder = async (req, res, next) => {
  try {
    const customer_id = req.user.user_id;
    const { store_id, delivery_address_id, note, delivery_fee } = req.body;
    const result = await orderService.placeOrder({ customer_id, store_id, delivery_address_id, note, delivery_fee });
    await notificationService.notifyOrderStatus(result.order_id, 'pending', customer_id);
    ok(res, result, 'Đặt hàng thành công');
  } catch (err) { next(err); }
};

const cancelOrder = async (req, res, next) => {
  try {
    const customer_id = req.user.user_id;
    const order_id = req.params.id;
    const { reason } = req.body;
    await orderService.cancelOrder(order_id, customer_id, reason, customer_id);
    await notificationService.notifyOrderStatus(order_id, 'cancelled', customer_id);
    ok(res, null, 'Hủy đơn hàng thành công');
  } catch (err) { next(err); }
};

const getMyOrders = async (req, res, next) => {
  try {
    const user = req.user;
    const store_id = req.user.store_id || null;
    const rows = await orderService.listOrders({ customer_id: user.user_id, store_id, role: user.role, user_id: user.user_id });
    ok(res, rows);
  } catch (err) { next(err); }
};

const getOrder = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) return fail(res, 'Đơn hàng không tồn tại', 404);
    if (req.user.role === 'customer' && order.customer_id !== req.user.user_id)
      return fail(res, 'Không có quyền xem đơn này', 403);
    ok(res, order);
  } catch (err) { next(err); }
};

const updateStatus = async (req, res, next) => {
  try {
    const order_id = req.params.id;
    const { status } = req.body;
    const changed_by = req.user.user_id;
    const r = await orderService.updateOrderStatus({ order_id, new_status: status, changed_by });
    await notificationService.notifyOrderStatus(order_id, status, r.customer_id);
    ok(res, null, 'Cập nhật trạng thái đơn hàng thành công');
  } catch (err) { next(err); }
};

const assignDelivery = async (req, res, next) => {
  try {
    const order_id = req.params.id;
    const { delivery_person_id } = req.body;
    const changed_by = req.user.user_id;
    await orderService.assignDelivery({ order_id, delivery_person_id, changed_by });
    await notificationService.notifyOrderStatus(order_id, 'delivering', null);
    ok(res, null, 'Phân công giao hàng thành công');
  } catch (err) { next(err); }
};

module.exports = { placeOrder, cancelOrder, getMyOrders, getOrder, updateStatus, assignDelivery };