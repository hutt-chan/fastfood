const ok      = (res, data, message = 'Thành công', status = 200) =>
  res.status(status).json({ success: true, message, data });

const created = (res, data, message = 'Tạo thành công') =>
  ok(res, data, message, 201);

const fail    = (res, message, status = 400) =>
  res.status(status).json({ success: false, message });

module.exports = { ok, created, fail };
