import { login }       from '../api/auth.api.js';
import { setSession }  from '../utils/auth.js';
import { toast }       from '../utils/toast.js';

const ROLE_HOME = {
  customer:       '/pages/customer/home.html',
  branch_manager: '/pages/branch-manager/dashboard.html',
  kitchen:        '/pages/kitchen/dashboard.html',
  delivery:       '/pages/delivery/dashboard.html',
  admin:          '/pages/admin/dashboard.html',
  warehouse:      '/pages/warehouse/dashboard.html',
};

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('errorMsg');
  try {
    errorMsg.style.display = 'none';
    const { data } = await login({ email, password });
    setSession(data.token, data.user);
    toast.success('Đăng nhập thành công!');
    const isLiveServer = window.location.port === '5500';
    const pathPrefix = isLiveServer ? '/frontend' : '';
    const target = ROLE_HOME[data.user.role] || '/';
    const redirectTo = `${window.location.origin}${pathPrefix}${target}`;
    setTimeout(() => window.location.href = redirectTo, 500);
  } catch (err) {
    errorMsg.textContent = err.message;
    errorMsg.style.display = 'block';
  }
});
