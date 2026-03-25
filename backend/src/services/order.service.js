const db              = require('../config/database');
const generateOrderCode = require('../utils/orderCode');

/**
 * UC6 — Đặt đơn hàng từ giỏ hàng
 */
const placeOrder = async ({ customer_id, store_id, delivery_address_id, note, delivery_fee = 0 }) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Lấy giỏ hàng
    const [[cart]] = await conn.execute(
      `SELECT cart_id FROM GioHang WHERE customer_id = ?`, [customer_id]
    );
    if (!cart) throw Object.assign(new Error('Giỏ hàng trống'), { status: 400 });

    const [items] = await conn.execute(
      `SELECT ctgh.product_id, ctgh.quantity, ctgh.note AS special_request,
              COALESCE(td.price_override, sp.base_price) AS unit_price
       FROM ChiTietGioHang ctgh
       JOIN SanPham sp ON ctgh.product_id = sp.product_id
       LEFT JOIN ThucDon_CuaHang td ON td.product_id = sp.product_id AND td.store_id = ?
       WHERE ctgh.cart_id = ?`,
      [store_id, cart.cart_id]
    );
    if (!items.length) throw Object.assign(new Error('Giỏ hàng trống'), { status: 400 });

    // 2. Tính tổng tiền
    const subtotal = items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
    const total    = subtotal + delivery_fee;

    // 3. Lấy sequence cho order_code
    const [[{ cnt }]] = await conn.execute(`SELECT COUNT(*) AS cnt FROM DonHang`);
    const order_code  = generateOrderCode(cnt + 1);

    // 4. Tạo đơn hàng
    const [orderResult] = await conn.execute(
      `INSERT INTO DonHang
         (order_code, order_type, status, subtotal, delivery_fee, total_amount,
          note, customer_id, store_id, delivery_address_id)
       VALUES (?, 'delivery', 'pending', ?, ?, ?, ?, ?, ?, ?)`,
      [order_code, subtotal, delivery_fee, total, note, customer_id, store_id, delivery_address_id]
    );
    const order_id = orderResult.insertId;

    // 5. Insert chi tiết đơn hàng
    for (const item of items) {
      await conn.execute(
        `INSERT INTO ChiTietDonHang (order_id, product_id, quantity, unit_price, special_request)
         VALUES (?, ?, ?, ?, ?)`,
        [order_id, item.product_id, item.quantity, item.unit_price, item.special_request]
      );
    }

    // 6. Tạo bản ghi thanh toán pending
    await conn.execute(
      `INSERT INTO ThanhToan (order_id, method, amount, status) VALUES (?, 'cod', ?, 'pending')`,
      [order_id, total]
    );

    // 7. Xóa giỏ hàng
    await conn.execute(`DELETE FROM ChiTietGioHang WHERE cart_id = ?`, [cart.cart_id]);

    await conn.commit();
    return { order_id, order_code, total };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

/**
 * UC10 — Hủy đơn hàng
 */
const cancelOrder = async (order_id, customer_id, cancel_reason, changed_by) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [[order]] = await conn.execute(
      `SELECT status FROM DonHang WHERE order_id = ? AND customer_id = ?`,
      [order_id, customer_id]
    );
    if (!order) throw Object.assign(new Error('Đơn hàng không tồn tại'), { status: 404 });
    if (!['pending','confirmed'].includes(order.status))
      throw Object.assign(new Error('Không thể hủy đơn ở trạng thái hiện tại'), { status: 400 });

    await conn.execute(
      `UPDATE DonHang SET status='cancelled', cancel_reason=?, cancelled_at=NOW() WHERE order_id=?`,
      [cancel_reason, order_id]
    );
    await conn.execute(
      `INSERT INTO LichSuTrangThai (order_id, old_status, new_status, changed_by, note)
       VALUES (?, ?, 'cancelled', ?, ?)`,
      [order_id, order.status, changed_by, cancel_reason]
    );
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

const getOrderById = async (order_id) => {
  const [[order]] = await db.execute(
    `SELECT dh.*, kh.customer_id, nd.full_name, nd.phone, nd.email
     FROM DonHang dh
     JOIN KhachHang kh ON dh.customer_id = kh.customer_id
     JOIN NguoiDung nd ON kh.customer_id = nd.user_id
     WHERE dh.order_id = ?`,
    [order_id]
  );
  if (!order) return null;
  const [items] = await db.execute(
     `SELECT ctdh.*, sp.product_name FROM ChiTietDonHang ctdh JOIN SanPham sp ON ctdh.product_id = sp.product_id WHERE ctdh.order_id = ?`,
     [order_id]
  );
  order.items = items;
  return order;
};

const listOrders = async ({ customer_id, store_id, role, user_id }) => {
  if (role === 'customer') {
    const [rows] = await db.execute(`SELECT * FROM DonHang WHERE customer_id = ? ORDER BY created_at DESC`, [customer_id]);
    return rows;
  }
  if (role === 'branch_manager') {
    const [rows] = await db.execute(`SELECT * FROM DonHang WHERE store_id = ? ORDER BY created_at DESC`, [store_id]);
    return rows;
  }
  if (role === 'kitchen') {
    const [rows] = await db.execute(`SELECT * FROM DonHang WHERE store_id = ? AND status IN ('confirmed','preparing','ready') ORDER BY created_at DESC`, [store_id]);
    return rows;
  }
  if (role === 'delivery') {
    const [rows] = await db.execute(`SELECT * FROM DonHang WHERE delivery_person_id = ? ORDER BY updated_at DESC`, [user_id]);
    return rows;
  }
  // admin and others
  const [rows] = await db.execute(`SELECT * FROM DonHang ORDER BY created_at DESC`);
  return rows;
};

const updateOrderStatus = async ({ order_id, new_status, changed_by }) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [[order]] = await conn.execute(`SELECT status, customer_id FROM DonHang WHERE order_id = ?`, [order_id]);
    if (!order) throw Object.assign(new Error('Đơn hàng không tồn tại'), { status: 404 });
    await conn.execute(`UPDATE DonHang SET status = ?, updated_at = NOW() WHERE order_id = ?`, [new_status, order_id]);
    await conn.execute(
      `INSERT INTO LichSuTrangThai (order_id, old_status, new_status, changed_by, changed_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [order_id, order.status, new_status, changed_by]
    );
    await conn.commit();
    return { ...order, status: new_status, customer_id: order.customer_id };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

const assignDelivery = async ({ order_id, delivery_person_id, changed_by }) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [[order]] = await conn.execute(`SELECT status FROM DonHang WHERE order_id = ?`, [order_id]);
    if (!order) throw Object.assign(new Error('Đơn hàng không tồn tại'), { status: 404 });
    if (order.status !== 'ready' && order.status !== 'confirmed')
      throw Object.assign(new Error('Chỉ có thể phân công với đơn ở trạng thái confirmed hoặc ready'), { status: 400 });
    await conn.execute(
      `UPDATE DonHang SET delivery_person_id = ?, status='delivering', updated_at = NOW() WHERE order_id = ?`,
      [delivery_person_id, order_id]
    );
    await conn.execute(
      `INSERT INTO LichSuTrangThai (order_id, old_status, new_status, changed_by, changed_at)
       VALUES (?, ?, 'delivering', ?, NOW())`,
      [order_id, order.status, changed_by]
    );
    await conn.commit();
    return true;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

module.exports = { placeOrder, cancelOrder, getOrderById, listOrders, updateOrderStatus, assignDelivery };
