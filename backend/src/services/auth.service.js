require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../config/database');
const { jwtSecret, jwtExpires, bcryptRounds } = require('../config/app');

/**
 * UC1 — Đăng ký tài khoản khách hàng
 */
const register = async ({ full_name, email, phone, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const hash = await bcrypt.hash(password, bcryptRounds);
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [r] = await conn.execute(
      `INSERT INTO NguoiDung (full_name, email, phone, password_hash, role, status)
       VALUES (?, ?, ?, ?, 'customer', 'active')`,
      [full_name, normalizedEmail, phone, hash]
    );
    await conn.execute(
      `INSERT INTO KhachHang (customer_id) VALUES (?)`,
      [r.insertId]
    );
    await conn.commit();
    return r.insertId;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

/**
 * UC2 — Đăng nhập
 * Hỗ trợ cả bcrypt hash lẫn {plain}text (chỉ dùng khi dev/seed)
 */
const login = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const [[user]] = await db.execute(
    `SELECT * FROM NguoiDung WHERE email = ? AND status = 'active'`,
    [normalizedEmail]
  );
  if (!user)
    throw Object.assign(new Error('Email hoặc mật khẩu không đúng'), { status: 401 });

  if (!user.password_hash)
    throw Object.assign(new Error('Lỗi cấu hình tài khoản: password_hash không tồn tại'), { status: 500 });

  // ── Kiểm tra password ──────────────────────────────────────
  let match = false;

  if (user.password_hash.startsWith('{plain}')) {
    // Dev mode: so sánh trực tiếp (KHÔNG dùng production)
    const plain = user.password_hash.slice(7); // bỏ prefix {plain}
    match = (plain === password);
  } else {
    // Production mode: bcrypt compare
    match = await bcrypt.compare(password, user.password_hash);
  }

  if (!match)
    throw Object.assign(new Error('Email hoặc mật khẩu không đúng'), { status: 401 });

  await db.execute(
    `UPDATE NguoiDung SET last_login = NOW() WHERE user_id = ?`,
    [user.user_id]
  );

  // Fetch store_id for roles that need it
  let store_id = null;
  if (user.role === 'branch_manager' || user.role === 'warehouse_manager' || user.role === 'kitchen_staff') {
    const [[employee]] = await db.execute(
      `SELECT store_id FROM NhanVien WHERE employee_id = ?`,
      [user.user_id]
    );
    if (employee) {
      store_id = employee.store_id;
    }
  }

  const token = jwt.sign(
    { user_id: user.user_id, role: user.role, full_name: user.full_name, store_id },
    jwtSecret,
    { expiresIn: jwtExpires }
  );

  const { password_hash: _, ...safeUser } = user;
  return { token, user: { ...safeUser, store_id } };
};

module.exports = { register, login };
