import { getUser, redirectIfNotRole, logout } from '../utils/auth.js';
import { toast } from '../utils/toast.js';

redirectIfNotRole('delivery');

// Load user info
const user = getUser();
document.getElementById('userName').textContent = `Xin chào, ${user.full_name}`;

// Logout handler
document.getElementById('logoutBtn').addEventListener('click', () => {
  logout();
});

// Load dashboard stats
async function loadStats() {
  try {
    // Mock data
    document.getElementById('assignedOrders').textContent = '3';
    document.getElementById('deliveredToday').textContent = '8';
    document.getElementById('earningsToday').textContent = '320.000đ';
    document.getElementById('rating').textContent = '4.7';
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
}

// Load current deliveries
async function loadCurrentDeliveries() {
  try {
    // Mock data
    const deliveries = [
      {
        id: '001',
        customer: 'Nguyễn Văn A',
        address: '123 Đường ABC, Quận 1',
        phone: '0123 456 789',
        items: ['Burger Gà', 'Coca Cola'],
        total: 150000,
        status: 'picked_up',
        estimatedTime: '15 phút'
      },
      {
        id: '002',
        customer: 'Trần Thị B',
        address: '456 Đường XYZ, Quận 2',
        phone: '0987 654 321',
        items: ['Pizza Hải sản'],
        total: 200000,
        status: 'assigned',
        estimatedTime: '25 phút'
      }
    ];

    const html = deliveries.length ? `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${deliveries.map(delivery => `
          <div class="card" style="border-left: 4px solid var(--primary);">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <div>
                <h4>Đơn #${delivery.id}</h4>
                <p><strong>Khách:</strong> ${delivery.customer}</p>
                <p><strong>Địa chỉ:</strong> ${delivery.address}</p>
                <p><strong>SĐT:</strong> ${delivery.phone}</p>
                <p><strong>Món:</strong> ${delivery.items.join(', ')}</p>
                <p><strong>Tổng:</strong> ${formatPrice(delivery.total)}</p>
                <p><strong>Dự kiến:</strong> ${delivery.estimatedTime}</p>
              </div>
              <div style="text-align: right;">
                <span class="badge badge-${delivery.status}">${getStatusText(delivery.status)}</span>
                <div style="margin-top: 1rem;">
                  <button class="btn btn-sm btn-success" onclick="markDelivered('${delivery.id}')">Đã giao</button>
                  <button class="btn btn-sm btn-danger" onclick="reportIssue('${delivery.id}')">Báo cáo</button>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    ` : '<p style="text-align: center; color: var(--gray);">Không có đơn hàng nào đang giao</p>';

    document.getElementById('currentDeliveries').innerHTML = html;
  } catch (error) {
    console.error('Failed to load deliveries:', error);
    document.getElementById('currentDeliveries').innerHTML = '<p>Không thể tải đơn hàng</p>';
  }
}

// Load delivery history
async function loadDeliveryHistory() {
  try {
    // Mock data
    const history = [
      { id: '003', customer: 'Lê Văn C', total: 95000, time: '09:45', status: 'delivered' },
      { id: '004', customer: 'Phạm Thị D', total: 180000, time: '08:30', status: 'delivered' },
    ];

    const html = `
      <table class="table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Tổng tiền</th>
            <th>Thời gian</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          ${history.map(order => `
            <tr>
              <td>${order.id}</td>
              <td>${order.customer}</td>
              <td>${formatPrice(order.total)}</td>
              <td>${order.time}</td>
              <td><span class="badge badge-${order.status}">${getStatusText(order.status)}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    document.getElementById('deliveryHistory').innerHTML = html;
  } catch (error) {
    console.error('Failed to load history:', error);
    document.getElementById('deliveryHistory').innerHTML = '<p>Không thể tải lịch sử</p>';
  }
}

// Helper functions
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

function getStatusText(status) {
  const statusMap = {
    assigned: 'Đã giao việc',
    picked_up: 'Đã lấy hàng',
    delivering: 'Đang giao',
    delivered: 'Đã giao',
    failed: 'Thất bại'
  };
  return statusMap[status] || status;
}

function markDelivered(orderId) {
  if (confirm('Xác nhận đã giao thành công đơn hàng #' + orderId + '?')) {
    toast.success('Đã cập nhật trạng thái đơn hàng');
    loadCurrentDeliveries(); // Refresh
  }
}

function reportIssue(orderId) {
  const reason = prompt('Lý do báo cáo:');
  if (reason) {
    toast.info('Đã báo cáo vấn đề cho đơn hàng #' + orderId);
  }
}

function updateStatus(status) {
  const statusText = status === 'available' ? 'Sẵn sàng' : 'Đang bận';
  toast.success('Đã cập nhật trạng thái: ' + statusText);
}

function viewMap() {
  toast.info('Tính năng xem bản đồ đang phát triển');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadCurrentDeliveries();
  loadDeliveryHistory();

  // Set current date
  const now = new Date();
  document.getElementById('currentDate').textContent =
    now.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
});