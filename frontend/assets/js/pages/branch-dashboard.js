import { redirectIfNotRole, initLogout } from '../utils/auth.js';
import { getBranchOrders, getRevenue, getDeliveryStaff } from '../api/branch.api.js';

redirectIfNotRole('branch_manager');

// Load sidebar
async function loadSidebar() {
  try {
    const response = await fetch('../../components/sidebar-branch.html');
    const html = await response.text();
    document.getElementById('sidebar').innerHTML = html;
    // Set active link
    const currentPage = window.location.pathname.split('/').pop();
    const links = document.querySelectorAll('.sidebar a');
    links.forEach(link => {
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
      }
    });
    initLogout();
  } catch (error) {
    console.error('Failed to load sidebar:', error);
  }
}

// Load dashboard stats
async function loadStats() {
  try {
    // Doanh thu 7 ngày
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 6);
    const fromDate = from.toISOString().split('T')[0];
    const toDate = to.toISOString().split('T')[0];

    const revenueResponse = await getRevenue({ from: fromDate, to: toDate });
    const revenueRows = revenueResponse.data || [];
    const totalRevenue = revenueRows.reduce((sum, r) => sum + Number(r.revenue || 0), 0);

    const ordersResponse = await getBranchOrders();
    const orders = ordersResponse.data || [];
    const today = new Date().toISOString().split('T')[0];
    const ordersToday = orders.filter((o) => (o.created_at || '').startsWith(today));

    const staffResponse = await getDeliveryStaff();
    const staff = staffResponse.data || [];

    document.getElementById('todayOrders').textContent = `${ordersToday.length}`;
    document.getElementById('todayRevenue').textContent = `${totalRevenue.toLocaleString('vi-VN')}đ`;
    document.getElementById('activeStaff').textContent = `${staff.length}`;
    document.getElementById('pendingOrders').textContent = `${orders.filter((o) => o.status === 'pending').length}`;
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
}

// Load today's orders
async function loadTodayOrders() {
  try {
    const response = await getBranchOrders();
    const orders = response.data || [];
    if (!orders.length) {
      document.getElementById('todayOrdersList').innerHTML = '<p>Chưa có đơn hàng.</p>';
      return;
    }

    const html = `
      <table class="table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Ngày</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          ${orders.slice(0, 10).map(order => `
            <tr>
              <td>${order.order_code || `#${order.order_id}`}</td>
              <td>${order.customer_id || 'khách'}</td>
              <td>${Number(order.total_amount).toLocaleString('vi-VN')} ₫</td>
              <td><span class="badge badge-${order.status}">${getStatusText(order.status)}</span></td>
              <td>${new Date(order.created_at).toLocaleString('vi-VN')}</td>
              <td><button class="btn btn-sm btn-primary" onclick="viewOrder('${order.order_id}')">Chi tiết</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    document.getElementById('todayOrdersList').innerHTML = html;
  } catch (error) {
    console.error('Failed to load orders:', error);
    document.getElementById('todayOrdersList').innerHTML = '<p>Không thể tải đơn hàng</p>';
  }
}

// Load staff status
async function loadStaffStatus() {
  try {
    const response = await getDeliveryStaff();
    const staff = response.data || [];

    if (!staff.length) {
      document.getElementById('staffStatus').innerHTML = '<p>Chưa có nhân viên giao hàng.</p>';
      return;
    }

    const html = `
      <table class="table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Điện thoại</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          ${staff.map(person => `
            <tr>
              <td>${person.full_name}</td>
              <td>${person.phone || '-'}</td>
              <td>${person.position || 'Giao hàng'}</td>
              <td><span class="badge ${person.status === 'active' ? 'badge-success' : 'badge-secondary'}">${person.status || 'unknown'}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    document.getElementById('staffStatus').innerHTML = html;
  } catch (error) {
    console.error('Failed to load staff:', error);
    document.getElementById('staffStatus').innerHTML = '<p>Không thể tải trạng thái nhân viên</p>';
  }
}

// Helper functions
function getStatusText(status) {
  const statusMap = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    preparing: 'Đang chuẩn bị',
    ready: 'Sẵn sàng',
    delivering: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy'
  };
  return statusMap[status] || status;
}

function viewOrder(orderId) {
  window.location.href = `orders.html?id=${orderId}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadSidebar();
  loadStats();
  loadTodayOrders();
  loadStaffStatus();

  const now = new Date();
  document.getElementById('currentDate').textContent =
    now.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      import('../utils/auth.js').then(mod => mod.logout());
    });
  }
});