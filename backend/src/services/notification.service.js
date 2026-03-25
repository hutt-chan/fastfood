const db = require('../config/database');

/**
 * UC31, UC32, UC36 — Lưu thông báo vào DB
 * (tích hợp FCM/Twilio ở production)
 */
const send = async ({ user_id, order_id = null, type, channel = 'push', title, body }) => {
  await db.execute(
    `INSERT INTO ThongBao (user_id, order_id, type, channel, title, body)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [user_id, order_id, type, channel, title, body]
  );
  // TODO: gọi FCM / Twilio tùy channel
};

/**
 * Gửi thông báo khi trạng thái đơn thay đổi — UC31
 */
const notifyOrderStatus = async (order_id, new_status, customer_id) => {
  const messages = {
    confirmed:  'Đơn hàng của bạn đã được xác nhận!',
    preparing:  'Nhà bếp đang chuẩn bị món ăn...',
    ready:      'Món ăn đã sẵn sàng, đang tìm tài xế giao hàng.',
    delivering: 'Tài xế đang trên đường đến bạn!',
    delivered:  'Đơn hàng đã giao thành công. Ngon miệng nhé!',
    cancelled:  'Đơn hàng của bạn đã bị hủy.',
  };
  await send({
    user_id:  customer_id,
    order_id,
    type:     'order_status',
    title:    `Cập nhật đơn hàng`,
    body:     messages[new_status] || `Trạng thái: ${new_status}`,
  });
};

module.exports = { send, notifyOrderStatus };
