const db = require('../../config/database');
const { ok, fail } = require('../../utils/response');

const listMenu = async (req, res, next) => {
  try {
    const [rows] = await db.execute(
      `SELECT sp.product_id, sp.product_name, sp.description, sp.base_price, sp.is_active,
              dc.category_name
       FROM SanPham sp
       LEFT JOIN DanhMuc dc ON sp.category_id = dc.category_id
       WHERE sp.is_active = TRUE`
    );
    ok(res, rows);
  } catch (err) {
    next(err);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const [rows] = await db.execute(
      `SELECT category_id as id, category_name as name
       FROM DanhMuc
       WHERE status = 'active'
       ORDER BY category_name`
    );
    ok(res, rows);
  } catch (err) {
    next(err);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const { category, limit = 20, featured = false } = req.query;
    let sql = `SELECT sp.product_id as id, sp.product_name as name, sp.description,
                      sp.base_price as price, sp.image_url as image, dc.category_name as category
               FROM SanPham sp
               LEFT JOIN DanhMuc dc ON sp.category_id = dc.category_id
               WHERE sp.is_active = TRUE`;
    const params = [];
    if (category) {
      sql += ' AND dc.category_id = ?';
      params.push(category);
    }
    if (featured === 'true') {
      sql += ' AND sp.is_featured = 1';
    }
    sql += ' ORDER BY sp.product_name';
    if (limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(limit));
    }
    const [rows] = await db.execute(sql, params);
    ok(res, rows);
  } catch (err) {
    next(err);
  }
};

const getItem = async (req, res, next) => {
  try {
    const product_id = req.params.id;
    const [[item]] = await db.execute(
      `SELECT sp.product_id, sp.product_name, sp.description, sp.base_price, sp.status,
              dc.category_name
       FROM SanPham sp
       LEFT JOIN DanhMuc dc ON sp.category_id = dc.category_id
       WHERE sp.product_id = ?`,
      [product_id]
    );
    if (!item) return fail(res, 'Món không tồn tại', 404);
    ok(res, item);
  } catch (err) {
    next(err);
  }
};

const searchMenu = async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const category = (req.query.category || '').trim();
    let sql = `SELECT sp.product_id, sp.product_name, sp.description, sp.base_price, sp.is_active, dc.category_name
               FROM SanPham sp
               LEFT JOIN DanhMuc dc ON sp.category_id = dc.category_id
               WHERE sp.is_active = TRUE`;
    const params = [];
    if (q) {
      sql += ' AND (sp.product_name LIKE ? OR sp.description LIKE ?)';
      params.push(`%${q}%`, `%${q}%`);
    }
    if (category) {
      sql += ' AND dc.category_name = ?';
      params.push(category);
    }
    const [rows] = await db.execute(sql, params);
    ok(res, rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { listMenu, getCategories, getProducts, getItem, searchMenu };