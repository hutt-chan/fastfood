const db = require('../../config/database');
const { ok, fail } = require('../../utils/response');
const vnpayService = require('../../services/payment-gateways/vnpay.service');

const choosePaymentMethod = async (req, res, next) => {
  try {
    const order_id = req.params.id;
    const { method } = req.body;
    const [[order]] = await db.execute('SELECT * FROM DonHang WHERE order_id = ?', [order_id]);
    if (!order) return fail(res, 'Đơn hàng không tồn tại', 404);
    if (method === 'cod') {
      await db.execute('UPDATE ThanhToan SET method = ?, status = "pending" WHERE order_id = ?', [method, order_id]);
      return ok(res, null, 'Chọn thanh toán COD thành công');
    }
    if (method === 'vnpay') {
      const url = vnpayService.createPaymentUrl(order_id, order.total_amount, `Thanh toán đơn ${order.order_code}`, req.ip);
      await db.execute('UPDATE ThanhToan SET method = ?, status = "processing" WHERE order_id = ?', [method, order_id]);
      return ok(res, { redirectUrl: url }, 'Chuyển sang cổng VNPAY');
    }
    return fail(res, 'Phương thức thanh toán không hợp lệ', 400);
  } catch (err) { next(err); }
};

const vnpayCallback = async (req, res, next) => {
  try {
    const { vnp_TxnRef, vnp_ResponseCode } = req.query;
    const [orderIdToken] = (vnp_TxnRef || '').split('_');
    const order_id = Number(orderIdToken);
    await db.execute('UPDATE ThanhToan SET status = ? WHERE order_id = ?', [vnp_ResponseCode === '00' ? 'paid' : 'failed', order_id]);
    if (vnp_ResponseCode === '00') {
      await db.execute('UPDATE DonHang SET status = "confirmed", updated_at = NOW() WHERE order_id = ?', [order_id]);
    }
    ok(res, { order_id, code: vnp_ResponseCode }, 'Xử lý callback VNPAY');
  } catch (err) { next(err); }
};

module.exports = { choosePaymentMethod, vnpayCallback };