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
    const { from, to, type = 'daily' } = req.query;
    let groupBy, selectDate;
    if (type === 'monthly') {
      selectDate = "DATE_FORMAT(created_at, '%Y-%m') AS date";
      groupBy = "DATE_FORMAT(created_at, '%Y-%m')";
    } else {
      selectDate = "DATE(created_at) AS date";
      groupBy = "DATE(created_at)";
    }
    const [rows] = await db.execute(
      `SELECT ${selectDate}, SUM(total_amount) AS revenue
       FROM DonHang
       WHERE store_id = ? AND created_at BETWEEN ? AND ? AND status = 'delivered'
       GROUP BY ${groupBy}
       ORDER BY ${groupBy}`,
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
       WHERE td.store_id = ? AND sp.is_active = TRUE`,
      [store_id]
    );
    ok(res, rows);
  } catch (err) { next(err); }
};

const addMenuItem = async (req, res, next) => {
  try {
    const store_id = req.user.store_id;
    const { product_id, price_override, is_available } = req.body;
    if (!product_id) return fail(res, 'product_id là bắt buộc', 400);

    const [[product]] = await db.execute('SELECT product_id FROM SanPham WHERE product_id = ? AND is_active = TRUE', [product_id]);
    if (!product) return fail(res, 'Sản phẩm không tồn tại', 404);

    const [[existing]] = await db.execute('SELECT 1 FROM ThucDon_CuaHang WHERE store_id = ? AND product_id = ?', [store_id, product_id]);
    if (existing) return fail(res, 'Sản phẩm đã tồn tại trong thực đơn chi nhánh', 400);

    await db.execute(
      `INSERT INTO ThucDon_CuaHang (store_id, product_id, is_available, price_override)
       VALUES (?, ?, ?, ?)`,
      [store_id, product_id, is_available === false ? false : true, price_override !== undefined && price_override !== null ? price_override : null]
    );
    ok(res, null, 'Thêm món vào thực đơn thành công');
  } catch (err) { next(err); }
};

const updateMenuItem = async (req, res, next) => {
  try {
    const store_id = req.user.store_id;
    const product_id = req.params.id;
    const { price_override, is_available, product_name, description } = req.body;

    const [[existing]] = await db.execute('SELECT * FROM ThucDon_CuaHang WHERE store_id = ? AND product_id = ?', [store_id, product_id]);
    if (!existing) return fail(res, 'Món không tồn tại trong thực đơn chi nhánh', 404);

    const updates = [];
    const params = [];

    if (price_override !== undefined) {
      updates.push('price_override = ?');
      params.push(price_override !== null ? price_override : null);
    }
    if (is_available !== undefined) {
      updates.push('is_available = ?');
      params.push(is_available);
    }

    if (product_name !== undefined || description !== undefined) {
      const productValues = [];
      const productUpdates = [];
      if (product_name !== undefined) {
        productUpdates.push('product_name = ?');
        productValues.push(product_name);
      }
      if (description !== undefined) {
        productUpdates.push('description = ?');
        productValues.push(description);
      }
      if (productUpdates.length) {
        await db.execute(`UPDATE SanPham SET ${productUpdates.join(', ')} WHERE product_id = ?`, [...productValues, product_id]);
      }
    }

    if (!updates.length) {
      if (product_name === undefined && description === undefined) {
        return fail(res, 'Chưa có dữ liệu cập nhật', 400);
      }
      return ok(res, null, 'Cập nhật món thành công');
    }

    params.push(store_id, product_id);
    await db.execute(`UPDATE ThucDon_CuaHang SET ${updates.join(', ')} WHERE store_id = ? AND product_id = ?`, params);
    ok(res, null, 'Cập nhật món thành công');
  } catch (err) { next(err); }
};

const deleteMenuItem = async (req, res, next) => {
  try {
    const store_id = req.user.store_id;
    const product_id = req.params.id;

    const [[existing]] = await db.execute('SELECT * FROM ThucDon_CuaHang WHERE store_id = ? AND product_id = ?', [store_id, product_id]);
    if (!existing) return fail(res, 'Món không tồn tại', 404);

    const [activeOrder] = await db.execute(
      `SELECT dh.order_id
       FROM DonHang dh
       JOIN ChiTietDonHang ctdh ON dh.order_id = ctdh.order_id
       WHERE dh.store_id = ?
         AND ctdh.product_id = ?
         AND dh.status IN ('pending','confirmed','preparing','ready','delivering')
       LIMIT 1`,
      [store_id, product_id]
    );

    if (activeOrder.length) {
      return fail(res, 'Không thể xóa món đang có trong đơn hàng đang xử lý', 400);
    }

    await db.execute('DELETE FROM ThucDon_CuaHang WHERE store_id = ? AND product_id = ?', [store_id, product_id]);
    ok(res, null, 'Xóa món thành công');
  } catch (err) { next(err); }
};

const rejectOrder = async (req, res, next) => {
  try {
    const order_id = req.params.id;
    const { reason } = req.body;
    const order = await orderService.getOrderById(order_id);

    if (!order) return fail(res, 'Đơn hàng không tồn tại', 404);
    if (order.store_id !== req.user.store_id) return fail(res, 'Không có quyền xử lý đơn hàng này', 403);

    await orderService.updateOrderStatus({ order_id, new_status: 'cancelled', changed_by: req.user.user_id, note: reason || 'Hủy bởi quản lý chi nhánh' });
    await notificationService.notifyOrderStatus(order_id, 'cancelled', order.customer_id);
    ok(res, null, 'Đơn hàng đã bị từ chối');
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
        nv.hire_date,
        nd.status as user_status
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

const createStaff = async (req, res, next) => {
  try {
    const store_id = req.user.store_id;
    const { full_name, email, phone, password, position } = req.body;

    const allowed = ['delivery', 'kitchen', 'warehouse'];
    if (!allowed.includes(position)) return fail(res, 'Vị trí nhân viên không hợp lệ', 400);
    if (!full_name || !email || !password) return fail(res, 'Thiếu thông tin bắt buộc', 400);

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      const [[existingUser]] = await conn.execute('SELECT 1 FROM NguoiDung WHERE email = ?', [email]);
      if (existingUser) throw Object.assign(new Error('Email đã tồn tại'), { status: 400 });

      const bcrypt = require('bcryptjs');
      const { bcryptRounds } = require('../../config/app');
      const password_hash = await bcrypt.hash(password, bcryptRounds);

      const [userResult] = await conn.execute(
        `INSERT INTO NguoiDung (full_name, email, phone, password_hash, role, status)
         VALUES (?, ?, ?, ?, ?, 'active')`,
        [full_name, email.toLowerCase(), phone, password_hash, position]
      );

      await conn.execute(
        `INSERT INTO NhanVien (employee_id, store_id, position, hire_date, employee_code, is_available)
         VALUES (?, ?, ?, CURDATE(), ?, TRUE)`,
        [userResult.insertId, store_id, position, 'EMP' + Date.now().toString().slice(-6)]
      );

      await conn.commit();
      ok(res, { employee_id: userResult.insertId }, 'Tạo nhân viên thành công');
    } catch (innerErr) {
      await conn.rollback();
      throw innerErr;
    } finally {
      conn.release();
    }
  } catch (err) {
    next(err);
  }
};

const updateStaff = async (req, res, next) => {
  try {
    const store_id = req.user.store_id;
    const employee_id = req.params.id;
    const { full_name, phone, position, is_available, status } = req.body;

    const [[staff]] = await db.execute('SELECT * FROM NhanVien WHERE employee_id = ? AND store_id = ?', [employee_id, store_id]);
    if (!staff) return fail(res, 'Nhân viên không tồn tại ở chi nhánh này', 404);

    const updatesNv = [];
    const paramsNv = [];
    if (position) {
      updatesNv.push('position = ?');
      paramsNv.push(position);
    }
    if (is_available !== undefined) {
      updatesNv.push('is_available = ?');
      paramsNv.push(is_available);
    }

    if (updatesNv.length) {
      paramsNv.push(employee_id);
      await db.execute(`UPDATE NhanVien SET ${updatesNv.join(', ')} WHERE employee_id = ?`, paramsNv);
    }

    const updatesNd = [];
    const paramsNd = [];
    if (full_name) { updatesNd.push('full_name = ?'); paramsNd.push(full_name); }
    if (phone) { updatesNd.push('phone = ?'); paramsNd.push(phone); }
    if (position) { updatesNd.push('role = ?'); paramsNd.push(position); }
    if (status) { updatesNd.push('status = ?'); paramsNd.push(status); }

    if (updatesNd.length) {
      paramsNd.push(employee_id);
      await db.execute(`UPDATE NguoiDung SET ${updatesNd.join(', ')} WHERE user_id = ?`, paramsNd);
    }

    ok(res, null, 'Cập nhật nhân viên thành công');
  } catch (err) {
    next(err);
  }
};

const disableStaff = async (req, res, next) => {
  try {
    const store_id = req.user.store_id;
    const employee_id = req.params.id;

    const [[staff]] = await db.execute('SELECT * FROM NhanVien WHERE employee_id = ? AND store_id = ?', [employee_id, store_id]);
    if (!staff) return fail(res, 'Nhân viên không tồn tại ở chi nhánh này', 404);

    await db.execute('UPDATE NguoiDung SET status = ? WHERE user_id = ?', ['locked', employee_id]);
    await db.execute('UPDATE NhanVien SET is_available = ? WHERE employee_id = ?', [false, employee_id]);

    ok(res, null, 'Vô hiệu hóa nhân viên thành công');
  } catch (err) {
    next(err);
  }
};

module.exports = { getOrderQueue, revenueReport, assignDelivery, updateOrderStatus, rejectOrder, getDeliveryStaff, createStaff, updateStaff, disableStaff, getBranchMenu, addMenuItem, updateMenuItem, deleteMenuItem };