import { getUser, redirectIfNotRole, logout } from '../utils/auth.js';
import { toast } from '../utils/toast.js';

redirectIfNotRole('kitchen');

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
    document.getElementById('pendingOrders').textContent = '5';
    document.getElementById('preparingOrders').textContent = '3';
    document.getElementById('readyOrders').textContent = '2';
    document.getElementById('completedToday').textContent = '24';
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
}

// Load order queue
async function loadOrderQueue() {
  try {
    // Mock data
    const orders = [
      {
        id: '001',
        customer: 'Nguyễn Văn A',
        items: [
          { name: 'Burger Gà', quantity: 2, notes: 'Ít rau' },
          { name: 'Khoai tây chiên', quantity: 1, notes: '' }
        ],
        orderTime: '10:30',
        estimatedTime: '15 phút'
      },
      {
        id: '002',
        customer: 'Trần Thị B',
        items: [
          { name: 'Pizza Hải sản', quantity: 1, notes: 'Không hành' }
        ],
        orderTime: '10:25',
        estimatedTime: '20 phút'
      }
    ];

    const html = orders.length ? `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${orders.map(order => `
          <div class="card" style="border-left: 4px solid var(--warning);">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <div>
                <h4>Đơn #${order.id} - ${order.customer}</h4>
                <p><strong>Thời gian đặt:</strong> ${order.orderTime}</p>
                <p><strong>Dự kiến:</strong> ${order.estimatedTime}</p>
                <div style="margin-top: 0.5rem;">
                  <strong>Món:</strong>
                  <ul style="margin: 0.5rem 0; padding-left: 1rem;">
                    ${order.items.map(item => `<li>${item.quantity}x ${item.name}${item.notes ? ` (${item.notes})` : ''}</li>`).join('')}
                  </ul>
                </div>
              </div>
              <div style="text-align: right;">
                <span class="badge badge-pending">Chờ chế biến</span>
                <div style="margin-top: 1rem;">
                  <button class="btn btn-sm btn-primary" onclick="startOrder('${order.id}')">Bắt đầu</button>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    ` : '<p style="text-align: center; color: var(--gray);">Không có đơn hàng nào chờ chế biến</p>';

    document.getElementById('orderQueue').innerHTML = html;
  } catch (error) {
    console.error('Failed to load queue:', error);
    document.getElementById('orderQueue').innerHTML = '<p>Không thể tải hàng đợi</p>';
  }
}

// Load preparing orders
async function loadPreparingOrders() {
  try {
    // Mock data
    const orders = [
      {
        id: '003',
        customer: 'Lê Văn C',
        items: [{ name: 'Burger Bò', quantity: 1 }],
        startTime: '10:15',
        progress: 75
      }
    ];

    const html = orders.length ? `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${orders.map(order => `
          <div class="card" style="border-left: 4px solid var(--primary);">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <div>
                <h4>Đơn #${order.id} - ${order.customer}</h4>
                <p><strong>Bắt đầu:</strong> ${order.startTime}</p>
                <div style="margin-top: 0.5rem;">
                  <strong>Món:</strong>
                  <ul style="margin: 0.5rem 0; padding-left: 1rem;">
                    ${order.items.map(item => `<li>${item.quantity}x ${item.name}</li>`).join('')}
                  </ul>
                </div>
                <div style="margin-top: 0.5rem;">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span>Tiến độ:</span>
                    <div style="flex: 1; background: var(--border); height: 8px; border-radius: 4px;">
                      <div style="background: var(--primary); height: 100%; border-radius: 4px; width: ${order.progress}%"></div>
                    </div>
                    <span>${order.progress}%</span>
                  </div>
                </div>
              </div>
              <div style="text-align: right;">
                <span class="badge badge-preparing">Đang chế biến</span>
                <div style="margin-top: 1rem;">
                  <button class="btn btn-sm btn-success" onclick="completeOrder('${order.id}')">Hoàn thành</button>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    ` : '<p style="text-align: center; color: var(--gray);">Không có đơn hàng nào đang chế biến</p>';

    document.getElementById('preparingOrdersList').innerHTML = html;
  } catch (error) {
    console.error('Failed to load preparing:', error);
    document.getElementById('preparingOrdersList').innerHTML = '<p>Không thể tải đơn chế biến</p>';
  }
}

// Load ready orders
async function loadReadyOrders() {
  try {
    // Mock data
    const orders = [
      { id: '004', customer: 'Phạm Thị D', readyTime: '10:00', items: [{ name: 'Salad Caesar', quantity: 1 }] }
    ];

    const html = orders.length ? `
      <table class="table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Món</th>
            <th>Sẵn sàng lúc</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          ${orders.map(order => `
            <tr>
              <td>${order.id}</td>
              <td>${order.customer}</td>
              <td>${order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}</td>
              <td>${order.readyTime}</td>
              <td>
                <button class="btn btn-sm btn-info" onclick="notifyDelivery('${order.id}')">Gọi giao hàng</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : '<p style="text-align: center; color: var(--gray);">Không có đơn hàng nào sẵn sàng</p>';

    document.getElementById('readyOrdersList').innerHTML = html;
  } catch (error) {
    console.error('Failed to load ready:', error);
    document.getElementById('readyOrdersList').innerHTML = '<p>Không thể tải đơn sẵn sàng</p>';
  }
}

// Helper functions
function startOrder(orderId) {
  toast.success('Đã bắt đầu chế biến đơn #' + orderId);
  loadOrderQueue();
  loadPreparingOrders();
}

function completeOrder(orderId) {
  toast.success('Đã hoàn thành đơn #' + orderId);
  loadPreparingOrders();
  loadReadyOrders();
  loadStats();
}

function notifyDelivery(orderId) {
  toast.info('Đã thông báo giao hàng cho đơn #' + orderId);
}

function startPreparing() {
  toast.info('Tính năng bắt đầu chế biến hàng loạt đang phát triển');
}

function markReady() {
  toast.info('Tính năng đánh dấu sẵn sàng hàng loạt đang phát triển');
}

function viewInventory() {
  toast.info('Tính năng xem tồn kho đang phát triển');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadOrderQueue();
  loadPreparingOrders();
  loadReadyOrders();

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