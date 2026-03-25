const warehouseService = require('../../services/warehouse.service');
const db = require('../../config/database');
const { ok, fail } = require('../../utils/response');

const getInventory = async (req, res, next) => {
  try {
    const store_id = req.query.store_id || req.user.store_id;
    const rows = await warehouseService.getInventory(store_id);
    ok(res, rows);
  } catch (err) { next(err); }
};

const importStock = async (req, res, next) => {
  try {
    const payload = {
      store_id: req.user.store_id,
      supplier_id: req.body.supplier_id,
      received_by: req.user.user_id,
      purchase_request_id: req.body.purchase_request_id || null,
      items: req.body.items || [],
      note: req.body.note || null,
    };
    const receipt_id = await warehouseService.importStock(payload);
    ok(res, { receipt_id }, 'Nhập kho thành công');
  } catch (err) { next(err); }
};

const lowStockReport = async (req, res, next) => {
  try {
    const store_id = req.query.store_id || req.user.store_id;
    const threshold = Number(req.query.threshold || 10);
    const [rows] = await db.execute(
      `SELECT * FROM TonKho WHERE store_id = ? AND quantity <= ?`, [store_id, threshold]
    );
    ok(res, rows);
  } catch (err) { next(err); }
};

module.exports = { getInventory, importStock, lowStockReport };