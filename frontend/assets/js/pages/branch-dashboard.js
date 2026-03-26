import { redirectIfNotRole, initLogout } from '../utils/auth.js';
import { getBranchOrders, getRevenue, getDeliveryStaff } from '../api/branch.api.js';
import { getLocalDateString } from '../utils/format.js';

const Chart = window.Chart;

redirectIfNotRole('branch_manager');

// Load sidebar
async function loadSidebar() {
  try {
    const response = await fetch('../../components/sidebar-branch.html');
    if (!response.ok) throw new Error('Failed to fetch sidebar');
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
    document.getElementById('sidebar').innerHTML = '<p>Lỗi tải sidebar</p>';
  }
}

// Load dashboard stats
async function loadStats() {
  try {
    // Doanh thu 7 ngày cho todayRevenue
    const to = new Date();
    const from7 = new Date();
    from7.setDate(to.getDate() - 6);
    const fromDate7 = getLocalDateString(from7);
    const toDate7 = getLocalDateString(to) + 'T23:59:59';

    console.log('Query revenue 7 days:', fromDate7, toDate7);
    const revenueResponse7 = await getRevenue({ from: fromDate7, to: toDate7 });
    const revenueRows7 = revenueResponse7.data || [];
    console.log('Revenue 7 days:', revenueRows7);
    const totalRevenue7 = revenueRows7.reduce((sum, r) => sum + Number(r.revenue || 0), 0);

    // Doanh thu tháng này
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    const currentMonthEnd = new Date();
    currentMonthEnd.setMonth(currentMonthEnd.getMonth() + 1);
    currentMonthEnd.setDate(0);
    const fromDateMonth = getLocalDateString(currentMonthStart);
    const toDateMonth = getLocalDateString(currentMonthEnd) + 'T23:59:59';

    console.log('Query revenue month:', fromDateMonth, toDateMonth);
    const revenueResponseMonth = await getRevenue({ from: fromDateMonth, to: toDateMonth });
    const revenueRowsMonth = revenueResponseMonth.data || [];
    console.log('Revenue month:', revenueRowsMonth);
    const totalRevenueMonth = revenueRowsMonth.reduce((sum, r) => sum + Number(r.revenue || 0), 0);

    const ordersResponse = await getBranchOrders();
    const orders = ordersResponse.data || [];
    console.log('Orders:', orders.length);
    const today = getLocalDateString();
    const currentMonth = today.substring(0, 7); // YYYY-MM
    const ordersToday = orders.filter((o) => (o.created_at || '').startsWith(today));
    const ordersMonth = orders.filter((o) => (o.created_at || '').startsWith(currentMonth));
    console.log('Orders today:', ordersToday.length, 'Orders month:', ordersMonth.length);

    document.getElementById('todayRevenue').textContent = `${totalRevenue7.toLocaleString('vi-VN')}đ`;
    document.getElementById('pendingOrders').textContent = `${orders.filter((o) => o.status === 'pending').length}`;
    document.getElementById('totalOrders').textContent = `${ordersMonth.length}`;
    document.getElementById('totalRevenue').textContent = `${totalRevenueMonth.toLocaleString('vi-VN')}đ`;
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
}

// Load revenue chart for 5 months
async function loadRevenueChart() {
  try {
    const to = new Date();
    const from = new Date();
    from.setMonth(to.getMonth() - 5);
    const fromDate = getLocalDateString(from) + 'T00:00:00';
    const toDate = getLocalDateString(to) + 'T23:59:59';

    const response = await getRevenue({ from: fromDate, to: toDate, type: 'monthly' });
    const data = response.data || [];

    const labels = [];
    const revenues = [];
    for (let i = 0; i < 5; i++) {
      const month = new Date();
      month.setMonth(month.getMonth() - (4 - i));
      const monthStr = month.getFullYear() + '-' + String(month.getMonth() + 1).padStart(2, '0');
      labels.push(monthStr);
      const found = data.find(d => d.date === monthStr);
      revenues.push(found ? Number(found.revenue) : 0);
    }

    const ctx = document.getElementById('revenueChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Doanh thu (VNĐ)',
          data: revenues,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return value.toLocaleString('vi-VN') + 'đ';
              }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Failed to load revenue chart:', error);
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
  showOrderDetail(orderId);
}

// Modal xem chi tiết đơn hàng
function showOrderDetail(orderId) {
  const modal = document.getElementById('orderDetailModal');
  const closeBtn = document.getElementById('closeOrderModal');
  const closeBtn2 = document.getElementById('closeBtn2');
  
  async function loadOrderDetail() {
    try {
      const response = await fetch(`/api/v1/orders/${orderId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) {
        alert('Không tìm thấy đơn hàng');
        return;
      }
      const { data: order } = await response.json();
      
      // Điền thông tin
      document.getElementById('modalOrderCode').textContent = order.order_code || `#${order.order_id}`;
      document.getElementById('modalOrderStatus').textContent = getStatusText(order.status);
      document.getElementById('modalCustomer').textContent = order.full_name || order.customer_id || '--';
      document.getElementById('modalOrderDate').textContent = new Date(order.created_at).toLocaleString('vi-VN');
      document.getElementById('modalAddress').textContent = order.delivery_address_id ? `Địa chỉ ${order.delivery_address_id}` : '--';
      document.getElementById('modalTotal').textContent = `${Number(order.total_amount).toLocaleString('vi-VN')} ₫`;
      
      // Danh sách sản phẩm
      const itemsHtml = (order.items || []).map(item => `
        <div class="item-row">
          <div>${item.product_name}</div>
          <div style="text-align: center;">${item.quantity}</div>
          <div style="text-align: right;">${Number(item.unit_price).toLocaleString('vi-VN')} ₫</div>
          <div style="text-align: right; font-weight: 600;">${(item.quantity * item.unit_price).toLocaleString('vi-VN')} ₫</div>
        </div>
      `).join('');
      
      if (itemsHtml) {
        document.getElementById('modalItems').innerHTML = `
          <div class="item-row" style="font-weight: 600; background: #f5f5f5; border-radius: 6px;">
            <div>Sản Phẩm</div>
            <div style="text-align: center;">SL</div>
            <div style="text-align: right;">Giá</div>
            <div style="text-align: right;">Thành Tiền</div>
          </div>
          ${itemsHtml}
        `;
      }
      
      modal.style.display = 'flex';
    } catch (err) {
      console.error(err);
      alert('Lỗi tải chi tiết đơn hàng');
    }
  }
  
  closeBtn.onclick = () => modal.style.display = 'none';
  closeBtn2.onclick = () => modal.style.display = 'none';
  modal.onclick = (e) => {
    if (e.target === modal) modal.style.display = 'none';
  };
  
  loadOrderDetail();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadSidebar();
  loadStats();
  loadRevenueChart();

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