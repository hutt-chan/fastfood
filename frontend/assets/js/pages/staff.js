import { redirectIfNotRole, initLogout } from '../utils/auth.js';
import { getDeliveryStaff } from '../api/branch.api.js';   // ← giữ nguyên import

redirectIfNotRole('branch_manager');

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

async function loadStaffList() {
  try {
    const response = await getDeliveryStaff();
    const staff = response.data || [];

    if (!staff.length) {
      document.getElementById('staffList').innerHTML = `
        <p class="text-center text-muted py-4">Chưa có nhân viên nào tại chi nhánh này.</p>`;
      return;
    }

    const html = `
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Tên nhân viên</th>
            <th>Điện thoại</th>
            <th>Vị trí</th>
            <th>Trạng thái</th>
            <th>Mã nhân viên</th>
          </tr>
        </thead>
        <tbody>
          ${staff.map(person => `
            <tr>
              <td>${person.full_name}</td>
              <td>${person.phone || '-'}</td>
              <td>${person.position}</td>
              <td>
                <span class="badge ${person.is_available ? 'badge-success' : 'badge-secondary'}">
                  ${person.is_available ? 'Đang sẵn sàng' : 'Bận'}
                </span>
              </td>
              <td>${person.employee_code || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;

    document.getElementById('staffList').innerHTML = html;
  } catch (error) {
    console.error('Failed to load staff:', error);
    document.getElementById('staffList').innerHTML = `
      <div class="alert alert-danger">Không thể tải danh sách nhân viên. Vui lòng thử lại sau.</div>`;
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadSidebar();
  loadStaffList();

  const now = new Date();
  // Nếu bạn muốn hiển thị ngày ở góc trên
  const dateEl = document.getElementById('currentDate');
  if (dateEl) dateEl.textContent = now.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
});