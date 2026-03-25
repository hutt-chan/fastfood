const db = require('../../config/database');
const { ok, fail } = require('../../utils/response');

const createReview = async (req, res, next) => {
  try {
    const customer_id = req.user.user_id;
    const { order_id, rating, comment } = req.body;
    await db.execute(
      `INSERT INTO DanhGia (order_id, customer_id, rating, comment, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [order_id, customer_id, rating, comment]
    );
    ok(res, null, 'Đánh giá thành công');
  } catch (err) { next(err); }
};

const getReviewsByOrder = async (req, res, next) => {
  try {
    const [rows] = await db.execute(
      `SELECT dg.*, nd.full_name
       FROM DanhGia dg
       JOIN NguoiDung nd ON dg.customer_id = nd.user_id
       WHERE dg.order_id = ?`,
      [req.params.id]
    );
    ok(res, rows);
  } catch (err) { next(err); }
};

const getReviewsByProduct = async (req, res, next) => {
  try {
    const [rows] = await db.execute(
      `SELECT dg.*, nd.full_name
       FROM DanhGia dg
       JOIN NguoiDung nd ON dg.customer_id = nd.user_id
       WHERE dg.product_id = ?`,
      [req.params.id]
    );
    ok(res, rows);
  } catch (err) { next(err); }
};

module.exports = { createReview, getReviewsByOrder, getReviewsByProduct };