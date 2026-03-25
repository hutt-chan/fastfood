const cron = require('node-cron');
const db   = require('../config/database');
const { send } = require('../services/notification.service');
const logger   = require('../utils/logger');

/**
 * UC36 — Chạy mỗi 30 phút, kiểm tra hàng sắp hết
 */
cron.schedule('*/30 * * * *', async () => {
  try {
    const [lowStock] = await db.execute(
      `SELECT tk.store_id, tk.ingredient_id, nl.ingredient_name,
              tk.quantity_available, tk.min_threshold, ch.store_name
       FROM TonKho tk
       JOIN NguyenLieu nl ON tk.ingredient_id = nl.ingredient_id
       JOIN CuaHang    ch ON tk.store_id       = ch.store_id
       WHERE tk.quantity_available <= tk.min_threshold AND ch.status = 'active'`
    );

    for (const item of lowStock) {
      // Lấy warehouse manager của chi nhánh
      const [[mgr]] = await db.execute(
        `SELECT employee_id FROM NhanVien
         WHERE store_id = ? AND position = 'warehouse' LIMIT 1`,
        [item.store_id]
      );
      if (mgr) {
        await send({
          user_id:  mgr.employee_id,
          type:     'low_stock',
          title:    'Cảnh báo hàng sắp hết',
          body:     `${item.ingredient_name} tại ${item.store_name}: còn ${item.quantity_available} (ngưỡng: ${item.min_threshold})`,
        });
      }
    }
    if (lowStock.length) logger.warn(`Stock alert: ${lowStock.length} items below threshold`);
  } catch (err) {
    logger.error('Stock alert job failed: ' + err.message);
  }
});
