const authService    = require('../../services/auth.service');
const { ok, created, fail } = require('../../utils/response');

const register = async (req, res, next) => {
  try {
    const user_id = await authService.register(req.body);
    created(res, { user_id }, 'Đăng ký tài khoản thành công');
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return fail(res, 'Email hoặc số điện thoại đã được đăng ký', 409);
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    ok(res, result, 'Đăng nhập thành công');
  } catch (err) {
    if (err.status === 401) return fail(res, err.message, 401);
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    // Có thể log logout event nếu cần
    ok(res, null, 'Đăng xuất thành công');
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, logout };
