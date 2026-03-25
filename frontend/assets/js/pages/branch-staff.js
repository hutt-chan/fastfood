import { redirectIfNotRole, initLogout } from '../utils/auth.js';
import { getDeliveryStaff, createStaff, updateStaff, disableStaff } from '../api/branch.api.js';
import { toast } from '../utils/toast.js';

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

async function renderStaffList() {
  try {
    const response = await getDeliveryStaff();
    const staff = response.data || [];
    const container = document.getElementById('staffList');

    if (!staff.length) {
      container.innerHTML = '<p class="text-center text-muted py-4">Chưa có nhân viên nào tại chi nhánh này.</p>';
      return;
    }

    container.innerHTML = `
      <h5 class="card-title mb-3">Danh sách nhân viên chi nhánh</h5>
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>Tên</th>
            <th>Vai trò</th>
            <th>Phone</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          ${staff.map(person => `
            <tr>
              <td>${person.full_name}</td>
              <td>${person.position}</td>
              <td>${person.phone || '-'}</td>
              <td>${person.user_status || 'active'} - ${person.is_available ? 'Sẵn sàng' : 'Không sẵn sàng'}</td>
              <td>
                <button class="btn btn-sm btn-secondary disable-staff" data-id="${person.employee_id}">Vô hiệu</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;

    document.querySelectorAll('.disable-staff').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Bạn có chắc muốn vô hiệu hóa nhân viên này?')) return;
        const employeeId = btn.dataset.id;
        try {
          await disableStaff(employeeId);
          toast.success('Vô hiệu hóa nhân viên thành công');
          await renderStaffList();
        } catch (err) {
          toast.error(err.message || 'Lỗi vô hiệu hóa người dùng');
        }
      });
    });
  } catch (error) {
    console.error('Failed to load staff:', error);
    document.getElementById('staffList').innerHTML = '<div class="alert alert-danger">Không thể tải danh sách nhân viên.</div>';
  }
}

async function initCreateForm() {
  const form = document.getElementById('createStaffForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const full_name = form.full_name.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const password = form.password.value;
    const position = form.position.value;

    try {
      await createStaff({ full_name, email, phone, password, position });
      toast.success('Thêm nhân viên thành công');
      form.reset();
      await renderStaffList();
    } catch (err) {
      toast.error(err.message || 'Lỗi thêm nhân viên');
    }
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  await loadSidebar();
  await renderStaffList();
  await initCreateForm();
});