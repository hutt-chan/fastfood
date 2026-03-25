const notificationService = require('../../services/notification.service');
const db = require('../../config/database');
const { ok, fail } = require('../../utils/response');

const listNotifications = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const [rows] = await db.execute(`SELECT * FROM ThongBao WHERE user_id = ? ORDER BY created_at DESC`, [user_id]);
    ok(res, rows);
  } catch (err) { next(err); }
};

const sendNotification = async (req, res, next) => {
  try {
    const { user_id, order_id, type, channel, title, body } = req.body;
    await notificationService.send({ user_id, order_id, type, channel, title, body });
    ok(res, null, 'Gửi thông báo thành công');
  } catch (err) { next(err); }
};

module.exports = { listNotifications, sendNotification };