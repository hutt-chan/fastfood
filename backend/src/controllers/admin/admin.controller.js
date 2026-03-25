const db = require('../../config/database');
const { ok, fail } = require('../../utils/response');

const listUsers = async (req, res, next) => {
  try {
    const [rows] = await db.execute(`SELECT user_id, full_name, email, phone, role, status FROM NguoiDung`);
    ok(res, rows);
  } catch (err) { next(err); }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { status, role } = req.body;
    await db.execute(`UPDATE NguoiDung SET status = ?, role = ? WHERE user_id = ?`, [status, role, user_id]);
    ok(res, null, 'Cập nhật người dùng thành công');
  } catch (err) { next(err); }
};

const systemConfig = async (req, res, next) => {
  try {
    const [configs] = await db.execute(`SELECT * FROM CauHinhHeThong`);
    ok(res, configs);
  } catch (err) { next(err); }
};

const updateSystemConfig = async (req, res, next) => {
  try {
    const { key, value } = req.body;
    await db.execute(`UPDATE CauHinhHeThong SET value = ? WHERE config_key = ?`, [value, key]);
    ok(res, null, 'Cập nhật cấu hình thành công');
  } catch (err) { next(err); }
};

module.exports = { listUsers, updateUserStatus, systemConfig, updateSystemConfig };