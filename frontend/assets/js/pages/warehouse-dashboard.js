import { getUser, redirectIfNotRole, initLogout } from '../utils/auth.js';

redirectIfNotRole('warehouse');

// Load sidebar
async function loadSidebar() {
  try {
    const response = await fetch('../../components/sidebar-warehouse.html');
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
    // Mock data
    document.getElementById('totalItems').textContent = '156';
    document.getElementById('lowStockItems').textContent = '8';
    document.getElementById('pendingImports').textContent = '3';
    document.getElementById('pendingExports').textContent = '2';
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
}

// Load low stock alert
async function loadLowStockAlert() {
  try {
    // Mock data
    const lowStockItems = [
      { name: 'Burger Bun', current: 5, min: 20, unit: 'cái' },
      { name: 'Thịt bò', current: 2, min: 10, unit: 'kg' },
      { name: 'Coca Cola', current: 8, min: 50, unit: 'chai' },
    ];

    const html = lowStockItems.length ? `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${lowStockItems.map(item => `
          <div class="card" style="border-left: 4px solid var(--danger);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h4 style="margin: 0; color: var(--danger);">${item.name}</h4>
                <p style="margin: 0.25rem 0; color: var(--gray);">
                  Còn: ${item.current} ${item.unit} (Tối thiểu: ${item.min} ${item.unit})
                </p>
              </div>
              <div style="text-align: right;">
                <span class="badge badge-danger">Cần nhập</span>
                <div style="margin-top: 0.5rem;">
                  <button class="btn btn-sm btn-primary" onclick="createImportRequest('${item.name}')">Tạo phiếu nhập</button>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    ` : '<p style="text-align: center; color: var(--gray);">Không có mặt hàng nào tồn kho thấp</p>';

    document.getElementById('lowStockAlert').innerHTML = html;
  } catch (error) {
    console.error('Failed to load low stock:', error);
    document.getElementById('lowStockAlert').innerHTML = '<p>Không thể tải cảnh báo tồn kho</p>';
  }
}

// Load recent activities
async function loadRecentActivities() {
  try {
    // Mock data
    const activities = [
      { type: 'import', item: 'Burger Bun', quantity: 50, unit: 'cái', time: '09:30', user: 'Nguyễn Văn A' },
      { type: 'export', item: 'Pizza Cheese', quantity: 10, unit: 'kg', time: '08:45', user: 'Trần Thị B' },
      { type: 'stocktake', item: 'Coca Cola', quantity: -2, unit: 'chai', time: '08:00', user: 'Lê Văn C' },
    ];

    const html = `
      <table class="table">
        <thead>
          <tr>
            <th>Thời gian</th>
            <th>Hoạt động</th>
            <th>Mặt hàng</th>
            <th>Số lượng</th>
            <th>Người thực hiện</th>
          </tr>
        </thead>
        <tbody>
          ${activities.map(activity => `
            <tr>
              <td>${activity.time}</td>
              <td>
                <span class="badge badge-${activity.type === 'import' ? 'success' : activity.type === 'export' ? 'primary' : 'info'}">
                  ${getActivityText(activity.type)}
                </span>
              </td>
              <td>${activity.item}</td>
              <td>${activity.quantity > 0 ? '+' : ''}${activity.quantity} ${activity.unit}</td>
              <td>${activity.user}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    document.getElementById('recentActivities').innerHTML = html;
  } catch (error) {
    console.error('Failed to load activities:', error);
    document.getElementById('recentActivities').innerHTML = '<p>Không thể tải hoạt động gần đây</p>';
  }
}

// Load pending requests
async function loadPendingRequests() {
  try {
    // Mock data
    const requests = [
      { id: '001', type: 'import', item: 'Thịt gà', quantity: 20, unit: 'kg', requester: 'Chi nhánh A', time: '10:00' },
      { id: '002', type: 'export', item: 'Burger Patty', quantity: 15, unit: 'cái', requester: 'Chi nhánh B', time: '09:30' },
    ];

    const html = requests.length ? `
      <table class="table">
        <thead>
          <tr>
            <th>Mã YC</th>
            <th>Loại</th>
            <th>Mặt hàng</th>
            <th>Số lượng</th>
            <th>Yêu cầu từ</th>
            <th>Thời gian</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          ${requests.map(request => `
            <tr>
              <td>${request.id}</td>
              <td>
                <span class="badge badge-${request.type === 'import' ? 'success' : 'primary'}">
                  ${request.type === 'import' ? 'Nhập' : 'Xuất'}
                </span>
              </td>
              <td>${request.item}</td>
              <td>${request.quantity} ${request.unit}</td>
              <td>${request.requester}</td>
              <td>${request.time}</td>
              <td>
                <button class="btn btn-sm btn-success" onclick="approveRequest('${request.id}')">Duyệt</button>
                <button class="btn btn-sm btn-danger" onclick="rejectRequest('${request.id}')">Từ chối</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : '<p style="text-align: center; color: var(--gray);">Không có yêu cầu nào chờ xử lý</p>';

    document.getElementById('pendingRequests').innerHTML = html;
  } catch (error) {
    console.error('Failed to load requests:', error);
    document.getElementById('pendingRequests').innerHTML = '<p>Không thể tải yêu cầu chờ xử lý</p>';
  }
}

// Helper functions
function getActivityText(type) {
  const types = {
    import: 'Nhập kho',
    export: 'Xuất kho',
    stocktake: 'Kiểm kê'
  };
  return types[type] || type;
}

function createImportRequest(itemName) {
  alert('Tính năng tạo phiếu nhập cho ' + itemName + ' đang phát triển');
}

function approveRequest(requestId) {
  if (confirm('Duyệt yêu cầu #' + requestId + '?')) {
    // Update UI
    loadPendingRequests();
    loadStats();
  }
}

function rejectRequest(requestId) {
  const reason = prompt('Lý do từ chối:');
  if (reason) {
    // Update UI
    loadPendingRequests();
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadSidebar();
  loadStats();
  loadLowStockAlert();
  loadRecentActivities();
  loadPendingRequests();

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