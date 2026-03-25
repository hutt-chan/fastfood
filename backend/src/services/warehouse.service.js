const db = require('../config/database');

/**
 * UC33 — Xem tồn kho
 */
const getInventory = async (store_id) => {
  const [rows] = await db.execute(
    `SELECT tk.*, nl.ingredient_name, nl.unit AS nl_unit
     FROM TonKho tk
     JOIN NguyenLieu nl ON tk.ingredient_id = nl.ingredient_id
     WHERE tk.store_id = ?
     ORDER BY nl.ingredient_name`,
    [store_id]
  );
  return rows;
};

/**
 * UC34 — Nhập kho (transaction)
 */
const importStock = async ({ store_id, supplier_id, received_by, purchase_request_id, items, note }) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const total_value = items.reduce((s, i) => s + i.quantity * i.unit_cost, 0);
    const [r] = await conn.execute(
      `INSERT INTO PhieuNhapKho (store_id, supplier_id, received_by, purchase_request_id, total_value, note)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [store_id, supplier_id, received_by, purchase_request_id, total_value, note]
    );
    for (const item of items) {
      await conn.execute(
        `INSERT INTO ChiTietNhapKho (receipt_id, ingredient_id, quantity, unit, unit_cost, total_cost)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [r.insertId, item.ingredient_id, item.quantity, item.unit, item.unit_cost,
         item.quantity * item.unit_cost]
      );
      // Trigger trg_nhap_kho_update_ton sẽ tự cập nhật TonKho
    }
    await conn.commit();
    return r.insertId;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

module.exports = { getInventory, importStock };
