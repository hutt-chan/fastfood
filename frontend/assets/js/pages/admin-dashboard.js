import { getUser, redirectIfNotRole, initLogout } from '../utils/auth.js';
import { toast } from '../utils/toast.js';

redirectIfNotRole('admin');

// Load sidebar
async function loadSidebar() {
  try {
    const response = await fetch('../../components/sidebar-admin.html');
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
    // Mock data for now - in real app, fetch from API
    document.getElementById('totalOrders').textContent = '156';
    document.getElementById('totalRevenue').textContent = '2.450.000đ';
    document.getElementById('activeUsers').textContent = '89';
    document.getElementById('pendingOrders').textContent = '12';
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
}

// Load recent orders
async function loadRecentOrders() {
  try {
    // Mock data
    const orders = [
      { id: '001', customer: 'Nguyễn Văn A', total: 150000, status: 'pending', time: '10:30' },
      { id: '002', customer: 'Trần Thị B', total: 200000, status: 'confirmed', time: '10:15' },
      { id: '003', customer: 'Lê Văn C', total: 95000, status: 'preparing', time: '09:45' },
    ];

    const html = `
      <table class="table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Thời gian</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          ${orders.map(order => `
            <tr>
              <td>${order.id}</td>
              <td>${order.customer}</td>
              <td>${formatPrice(order.total)}</td>
              <td><span class="badge badge-${order.status}">${getStatusText(order.status)}</span></td>
              <td>${order.time}</td>
              <td>
                <button class="btn btn-sm btn-primary" onclick="viewOrder('${order.id}')">Xem</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    document.getElementById('recentOrders').innerHTML = html;
  } catch (error) {
    console.error('Failed to load orders:', error);
    document.getElementById('recentOrders').innerHTML = '<p>Không thể tải đơn hàng</p>';
  }
}

// Helper functions
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

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
  // Navigate to order detail page
  window.location.href = `order-detail.html?id=${orderId}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadSidebar();
  loadStats();
  loadRecentOrders();

  // Set current date
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