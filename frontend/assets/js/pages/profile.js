import { redirectIfNotRole, getUser, setSession, logout } from '../utils/auth.js';
import { getProfile, updateProfile } from '../api/profile.api.js';
import { toast } from '../utils/toast.js';

redirectIfNotRole('customer');

const user = getUser();
const container = document.createElement('div');
container.className = 'container';
container.style.paddingTop = '2rem';
container.innerHTML = `
  <h1>Hồ sơ cá nhân</h1>
  <form id="profileForm" class="form">
    <label>Họ và tên</label>
    <input id="full_name" value="${user.full_name || ''}" class="form-control" required>
    <label>Email</label>
    <input id="email" value="${user.email || ''}" class="form-control" disabled>
    <label>Số điện thoại</label>
    <input id="phone" value="${user.phone || ''}" class="form-control">
    <button type="submit" class="btn btn-primary" style="margin-top:1rem">Cập nhật</button>
    <button type="button" id="logoutBtn" class="btn btn-secondary" style="margin-top:1rem; margin-left:1rem">🚪 Đăng xuất</button>
  </form>
`;

document.body.innerHTML = '';
document.body.appendChild(container);

// Logout handler
document.getElementById('logoutBtn').addEventListener('click', () => {
  logout();
});

const form = document.getElementById('profileForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const full_name = document.getElementById('full_name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    await updateProfile({ full_name, phone });
    const updated = { ...user, full_name, phone };
    setSession(localStorage.getItem('token'), updated);
    toast.success('Cập nhật hồ sơ thành công');
  } catch (err) {
    toast.error(err.message || 'Lỗi cập nhật');
  }
});
