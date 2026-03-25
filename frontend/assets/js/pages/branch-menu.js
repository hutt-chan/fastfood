import { redirectIfNotRole, initLogout } from '../utils/auth.js';
import { getBranchMenu } from '../api/branch.api.js';
import { toast } from '../utils/toast.js';

redirectIfNotRole('branch_manager');

async function loadSidebar() {
  try {
    const response = await fetch('../../components/sidebar-branch.html');
    const html = await response.text();
    document.getElementById('sidebar').innerHTML = html;
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar a').forEach(link => {
      if (link.getAttribute('href') === currentPage) link.classList.add('active');
    });
    initLogout();
  } catch (error) {
    console.error('Failed to load sidebar:', error);
  }
}

async function renderMenu() {
  try {
    const { data } = await getBranchMenu();
    const menuItems = data || [];
    const container = document.getElementById('menuList');
    if (!menuItems.length) {
      container.innerHTML = '<p>Không có sản phẩm.</p>';
      return;
    }

    container.innerHTML = `
      <div class="grid-3">
        ${menuItems.map(item => `
          <div class="card">
            <h3>${item.product_name}</h3>
            <p>${item.description || 'Không có mô tả'}</p>
            <p><strong>Giá hiển thị:</strong> ${Number(item.effective_price).toLocaleString('vi-VN')} ₫</p>
            <p><small>Giá gốc: ${Number(item.price).toLocaleString('vi-VN')} ₫</small></p>
          </div>
        `).join('')}
      </div>
    `;
  } catch (err) {
    console.error(err);
    toast.error('Lỗi tải dữ liệu thực đơn');
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  await loadSidebar();
  await renderMenu();
});