import { redirectIfNotRole, initLogout } from '../utils/auth.js';
import { getDeliveryStaff } from '../api/branch.api.js';

redirectIfNotRole('branch_manager');

// Load sidebar (chung cho mọi trang branch)
async function loadSidebar() {
  try {
    const response = await fetch('../../components/sidebar-branch.html');
    const html = await response.text();
    document.getElementById('sidebar').innerHTML = html;
    initLogout();
  } catch (error) {
    console.error('Failed to load sidebar:', error);
  }
}

// ==================== CHỈ LOAD DANH SÁCH NHÂN VIÊN ====================
async function loadStaffList() {
  try {
    const response = await getDeliveryStaff();
    const staff = response.data || [];

    const container = document.getElementById('staffList');

    if (!staff.length) {
      container.innerHTML = `
        <p class="text-center text-muted py-4">Chưa có nhân viên nào tại chi nhánh này.</p>`;
      return;
    }

    const html = `
      <h5 class="card-title mb-3">Danh sách nhân viên chi nhánh</h5>
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>Tên nhân viên</th>
            <th>Điện thoại</th>
            <th>Vị trí</th>
            <th>Trạng thái</th>
            <th>Mã NV</th>
          </tr>
        </thead>
        <tbody>
          ${staff.map(person => `
            <tr>
              <td><strong>${person.full_name}</strong></td>
              <td>${person.phone || '-'}</td>
              <td>${person.position === 'delivery' ? 'Giao hàng' : 
                    person.position === 'kitchen' ? 'Bếp' : 
                    person.position === 'branch_manager' ? 'Quản lý' : 'Kho'}</td>
              <td>
                <span class="badge ${person.is_available ? 'badge-success' : 'badge-secondary'}">
                  ${person.is_available ? '✅ Sẵn sàng' : '⏳ Bận'}
                </span>
              </td>
              <td><code>${person.employee_code || '-'}</code></td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;

    container.innerHTML = html;
  } catch (error) {
    console.error('Failed to load staff:', error);
    document.getElementById('staffList').innerHTML = `
      <div class="alert alert-danger">
        Không thể tải danh sách nhân viên.<br>
        <small>Vui lòng kiểm tra console hoặc thử tải lại trang.</small>
      </div>`;
  }
}

// ==================== KHỞI ĐỘNG TRANG ====================
document.addEventListener('DOMContentLoaded', () => {
  loadSidebar();
  loadStaffList();

  // Nếu bạn muốn hiển thị ngày hiện tại (tùy chọn)
  const dateEl = document.getElementById('currentDate');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
});