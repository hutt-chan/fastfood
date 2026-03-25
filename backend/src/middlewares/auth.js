const jwt  = require('jsonwebtoken');
const db   = require('../config/database');
const { jwtSecret } = require('../config/app');

/**
 * Xác thực JWT — UC1, UC2
 */
const authenticate = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ message: 'Chưa đăng nhập' });

  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, jwtSecret);
    // If store_id not in token but role requires it, fetch from DB
    if (!req.user.store_id && ['branch_manager', 'warehouse_manager', 'kitchen_staff'].includes(req.user.role)) {
      try {
        const [[employee]] = await db.execute(
          `SELECT store_id FROM NhanVien WHERE employee_id = ?`,
          [req.user.user_id]
        );
        if (employee) {
          req.user.store_id = employee.store_id;
        }
      } catch (dbErr) {
        console.error('Error fetching store_id:', dbErr);
        // Continue without store_id, let the controller handle it
      }
    }
    next();
  } catch {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

/**
 * Phân quyền theo role — UC25
 * @param {...string} roles - Danh sách role được phép
 */
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role))
    return res.status(403).json({ message: 'Không có quyền truy cập' });
  next();
};

module.exports = { authenticate, authorize };
