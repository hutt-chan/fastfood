const db = require('../../config/database');
const orderService = require('../../services/order.service');
const { ok, fail } = require('../../utils/response');

const getProfile = async (req, res, next) => {
  try {
    const [[user]] = await db.execute(`SELECT user_id, full_name, email, phone, role, status FROM NguoiDung WHERE user_id = ?`, [req.user.user_id]);
    if (!user) return fail(res, 'Người dùng không tồn tại', 404);
    ok(res, user);
  } catch (err) { next(err); }
};

const updateProfile = async (req, res, next) => {
  try {
    const { full_name, phone } = req.body;
    await db.execute('UPDATE NguoiDung SET full_name = ?, phone = ? WHERE user_id = ?', [full_name, phone, req.user.user_id]);
    ok(res, null, 'Cập nhật thông tin thành công');
  } catch (err) { next(err); }
};

const getOrderHistory = async (req, res, next) => {
  try {
    const orders = await orderService.listOrders({ customer_id: req.user.user_id, role: 'customer' });
    ok(res, orders);
  } catch (err) { next(err); }
};

module.exports = { getProfile, updateProfile, getOrderHistory };