const db = require('../../config/database');
const { ok, fail } = require('../../utils/response');

const listStores = async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT * FROM CuaHang WHERE status = "active" ORDER BY store_name');
    ok(res, rows);
  } catch (err) { next(err); }
};

const getStore = async (req, res, next) => {
  try {
    const [[store]] = await db.execute('SELECT * FROM CuaHang WHERE store_id = ?', [req.params.id]);
    if (!store) return fail(res, 'Cửa hàng không tồn tại', 404);
    ok(res, store);
  } catch (err) { next(err); }
};

const createStore = async (req, res, next) => {
  try {
    const { store_name, address, phone } = req.body;
    const [result] = await db.execute(
      'INSERT INTO CuaHang (store_name, address, phone, status, created_at) VALUES (?, ?, ?, "active", NOW())',
      [store_name, address, phone]
    );
    ok(res, { store_id: result.insertId }, 'Tạo cửa hàng thành công', 201);
  } catch (err) { next(err); }
};

const updateStore = async (req, res, next) => {
  try {
    const { store_name, address, phone, status } = req.body;
    const [result] = await db.execute(
      'UPDATE CuaHang SET store_name = ?, address = ?, phone = ?, status = ? WHERE store_id = ?',
      [store_name, address, phone, status || 'active', req.params.id]
    );
    if (!result.affectedRows) return fail(res, 'Cửa hàng không tồn tại', 404);
    ok(res, null, 'Cập nhật cửa hàng thành công');
  } catch (err) { next(err); }
};

const deleteStore = async (req, res, next) => {
  try {
    const [result] = await db.execute('UPDATE CuaHang SET status = "inactive" WHERE store_id = ?', [req.params.id]);
    if (!result.affectedRows) return fail(res, 'Cửa hàng không tồn tại', 404);
    ok(res, null, 'Đóng cửa hàng thành công');
  } catch (err) { next(err); }
};

module.exports = { listStores, getStore, createStore, updateStore, deleteStore };