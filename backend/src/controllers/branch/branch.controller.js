const db = require('../../config/database');
const orderService = require('../../services/order.service');
const notificationService = require('../../services/notification.service');
const { ok, fail } = require('../../utils/response');

const getOrderQueue = async (req, res, next) => {
  try {
    const store_id = req.user.store_id;
    const { status } = req.query;
    let query = `SELECT * FROM DonHang WHERE store_id = ?`;
    const params = [store_id];
    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }
    query += ` ORDER BY created_at DESC`;
    const [rows] = await db.execute(query, params);
    ok(res, rows);
  } catch (err) { next(err); }
};

const revenueReport = async (req, res, next) => {
  try {
    const store_id = req.user.store_id;
    const { from, to } = req.query;
    const [rows] = await db.execute(
      `SELECT DATE(created_at) AS date, SUM(total_amount) AS revenue
       FROM DonHang
       WHERE store_id = ? AND created_at BETWEEN ? AND ? AND status = 'delivered'
       GROUP BY DATE(created_at)
       ORDER BY DATE(created_at)`,
      [store_id, from, to]
    );
    ok(res, rows);
  } catch (err) { next(err); }
};

const assignDelivery = async (req, res, next) => {
  try {
    const order_id = req.params.id;
    const delivery_person_id = req.body.delivery_person_id;
    const order = await orderService.getOrderById(order_id);
    if (!order) return fail(res, 'Đơn hàng không tồn tại', 404);
    if (order.store_id !== req.user.store_id) return fail(res, 'Không có quyền phân công đơn hàng này', 403);

    await orderService.assignDelivery({ order_id, delivery_person_id, changed_by: req.user.user_id });
    await notificationService.notifyOrderStatus(order_id, 'delivering', order.customer_id);
    ok(res, null, 'Phân công giao hàng thành công');
  } catch (err) { next(err); }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order_id = req.params.id;
    const { status } = req.body;
    const order = await orderService.getOrderById(order_id);
    if (!order) return fail(res, 'Đơn hàng không tồn tại', 404);
    if (order.store_id !== req.user.store_id) return fail(res, 'Không có quyền cập nhật đơn hàng này', 403);

    const result = await orderService.updateOrderStatus({ order_id, new_status: status, changed_by: req.user.user_id });
    await notificationService.notifyOrderStatus(order_id, status, order.customer_id);
    ok(res, null, 'Cập nhật trạng thái đơn hàng thành công');
  } catch (err) { next(err); }
};

const getBranchMenu = async (req, res, next) => {
  try {
    const store_id = req.user.store_id;
    const [rows] = await db.execute(
      `SELECT sp.product_id, sp.product_name, sp.description, sp.base_price as price,
              td.is_available, td.price_override,
              COALESCE(td.price_override, sp.base_price) as effective_price,
              dc.category_name
       FROM ThucDon_CuaHang td
       JOIN SanPham sp ON td.product_id = sp.product_id
       LEFT JOIN DanhMuc dc ON sp.category_id = dc.category_id
       WHERE td.store_id = ? AND td.is_available = TRUE AND sp.is_active = TRUE`,
      [store_id]
    );
    ok(res, rows);
  } catch (err) { next(err); }
};

const getDeliveryStaff = async (req, res, next) => {
  try {
    const store_id = req.user.store_id;

    if (!store_id) {
      return res.status(400).json({ success: false, message: 'Không tìm thấy store_id của bạn' });
    }

    const [rows] = await db.execute(`
      SELECT 
        nv.employee_id,
        nd.full_name,
        nd.phone,
        nv.position,
        nv.is_available,           -- ← CỘT ĐÚNG (không phải status)
        nv.employee_code,
        nv.hire_date
      FROM NhanVien nv
      JOIN NguoiDung nd ON nv.employee_id = nd.user_id
      WHERE nv.store_id = ?
        AND nv.position IN ('delivery', 'kitchen', 'branch_manager', 'warehouse')
      ORDER BY nv.position, nd.full_name
    `, [store_id]);

    ok(res, rows);   // giữ nguyên cách trả về của bạn
  } catch (err) {
    console.error('getDeliveryStaff error:', err);
    next(err);
  }
};

module.exports = { getOrderQueue, revenueReport, assignDelivery, updateOrderStatus, getDeliveryStaff, getBranchMenu };