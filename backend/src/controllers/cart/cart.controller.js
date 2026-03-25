const db = require('../../config/database');
const { ok, fail } = require('../../utils/response');

const getCart = async (req, res, next) => {
  try {
    const customer_id = req.user.user_id;
    const [[cart]] = await db.execute('SELECT cart_id FROM GioHang WHERE customer_id = ?', [customer_id]);
    if (!cart) return ok(res, { items: [] });

    const [items] = await db.execute(
      `SELECT ctgh.product_id, ctgh.quantity, ctgh.note, sp.product_name, sp.base_price
       FROM ChiTietGioHang ctgh
       JOIN SanPham sp ON sp.product_id = ctgh.product_id
       WHERE ctgh.cart_id = ?`,
      [cart.cart_id]
    );
    ok(res, { cart_id: cart.cart_id, items });
  } catch (err) { next(err); }
};

const ensureCart = async (customer_id) => {
  const [[cart]] = await db.execute('SELECT cart_id FROM GioHang WHERE customer_id = ?', [customer_id]);
  if (cart) return cart.cart_id;
  const [result] = await db.execute('INSERT INTO GioHang (customer_id, created_at) VALUES (?, NOW())', [customer_id]);
  return result.insertId;
};

const addItem = async (req, res, next) => {
  try {
    const customer_id = req.user.user_id;
    const { product_id, quantity = 1, note } = req.body;
    const cart_id = await ensureCart(customer_id);

    const [[existing]] = await db.execute(
      'SELECT quantity FROM ChiTietGioHang WHERE cart_id = ? AND product_id = ?',
      [cart_id, product_id]
    );
    if (existing) {
      await db.execute(
        'UPDATE ChiTietGioHang SET quantity = ? WHERE cart_id = ? AND product_id = ?',
        [existing.quantity + Number(quantity), cart_id, product_id]
      );
    } else {
      await db.execute(
        'INSERT INTO ChiTietGioHang (cart_id, product_id, quantity, note) VALUES (?, ?, ?, ?)',
        [cart_id, product_id, quantity, note || null]
      );
    }
    ok(res, null, 'Thêm vào giỏ hàng thành công');
  } catch (err) { next(err); }
};

const updateItem = async (req, res, next) => {
  try {
    const customer_id = req.user.user_id;
    const { product_id } = req.params;
    const { quantity } = req.body;
    const [[cart]] = await db.execute('SELECT cart_id FROM GioHang WHERE customer_id = ?', [customer_id]);
    if (!cart) return fail(res, 'Giỏ hàng không tồn tại', 404);
    const [result] = await db.execute(
      'UPDATE ChiTietGioHang SET quantity = ? WHERE cart_id = ? AND product_id = ?',
      [quantity, cart.cart_id, product_id]
    );
    if (!result.affectedRows) return fail(res, 'Món không tồn tại trong giỏ', 404);
    ok(res, null, 'Cập nhật số lượng thành công');
  } catch (err) { next(err); }
};

const removeItem = async (req, res, next) => {
  try {
    const customer_id = req.user.user_id;
    const { product_id } = req.params;
    const [[cart]] = await db.execute('SELECT cart_id FROM GioHang WHERE customer_id = ?', [customer_id]);
    if (!cart) return fail(res, 'Giỏ hàng không tồn tại', 404);
    const [result] = await db.execute(
      'DELETE FROM ChiTietGioHang WHERE cart_id = ? AND product_id = ?',
      [cart.cart_id, product_id]
    );
    if (!result.affectedRows) return fail(res, 'Món không tồn tại', 404);
    ok(res, null, 'Xóa món khỏi giỏ hàng thành công');
  } catch (err) { next(err); }
};

const clearCart = async (req, res, next) => {
  try {
    const customer_id = req.user.user_id;
    const [[cart]] = await db.execute('SELECT cart_id FROM GioHang WHERE customer_id = ?', [customer_id]);
    if (!cart) return ok(res, null, 'Giỏ hàng đã rỗng');
    await db.execute('DELETE FROM ChiTietGioHang WHERE cart_id = ?', [cart.cart_id]);
    ok(res, null, 'Xóa giỏ hàng thành công');
  } catch (err) { next(err); }
};

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };