import { redirectIfNotRole, initLogout } from '../utils/auth.js';
import { getBranchOrders, assignDelivery, updateOrderStatus, getRevenue } from '../api/branch.api.js';
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

const fetchOrders = async () => {
  try {
    const { data } = await getBranchOrders();
    return data || [];
  } catch (err) {
    toast.error('Không thể tải đơn hàng: ' + (err.message || 'Lỗi'));
    return [];
  }
};

function statusLabel(status) {
  const map = {
    pending: 'Chờ',
    confirmed: 'Đã xác nhận',
    preparing: 'Chuẩn bị',
    ready: 'Sẵn sàng',
    delivering: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy'
  };
  return map[status] || status;
}

function orderActions(order) {
  const updateSelect = `
    <select class="status-select" data-id="${order.order_id}">
      <option value="">-- Cập nhật --</option>
      <option value="confirmed">Đã xác nhận</option>
      <option value="preparing">Chuẩn bị</option>
      <option value="ready">Sẵn sàng</option>
      <option value="delivering">Đang giao</option>
      <option value="delivered">Đã giao</option>
      <option value="cancelled">Đã hủy</option>
    </select>
  `;
  return `${updateSelect}`;
}

const renderOrders = async (filterStatus = '') => {
  const allOrders = await fetchOrders();
  const orders = filterStatus ? allOrders.filter((o) => o.status === filterStatus) : allOrders;
  const container = document.getElementById('orderTable');
  if (!orders.length) {
    container.innerHTML = '<p>Không có đơn hàng.</p>';
    return;
  }

  container.innerHTML = `
    <table class="table">
      <thead><tr><th>#</th><th>Mã đơn</th><th>Khách</th><th>Tổng</th><th>Tình trạng</th><th>Ngày</th><th>Cập nhật</th><th>Giao</th></tr></thead>
      <tbody>
        ${orders.map((order, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td>${order.order_code || order.order_id}</td>
            <td>${order.customer_id || '-'}</td>
            <td>${Number(order.total_amount).toLocaleString('vi-VN')} ₫</td>
            <td>${statusLabel(order.status)}</td>
            <td>${new Date(order.created_at).toLocaleString('vi-VN')}</td>
            <td>${orderActions(order)}</td>
            <td>
              <input type="number" min="1" placeholder="ID NV" class="delivery-id" data-id="${order.order_id}" style="width:80px" />
              <button class="btn btn-sm btn-success assign-btn" data-id="${order.order_id}">Giao</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  document.querySelectorAll('.status-select').forEach(select => {
    select.addEventListener('change', async (e) => {
      const order_id = e.target.dataset.id;
      const status = e.target.value;
      if (!status) return;
      try {
        await updateOrderStatus(order_id, status);
        toast.success('Cập nhật trạng thái thành công');
        await renderOrders(filterStatus);
      } catch (err) {
        toast.error(err.message || 'Lỗi cập nhật trạng thái');
      }
    });
  });

  document.querySelectorAll('.assign-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const order_id = btn.dataset.id;
      const input = document.querySelector(`.delivery-id[data-id="${order_id}"]`);
      const delivery_person_id = input.value;
      if (!delivery_person_id) {
        toast.error('Nhập ID nhân viên giao hàng');
        return;
      }

      try {
        await assignDelivery(order_id, Number(delivery_person_id));
        toast.success('Đã phân công giao hàng thành công');
        await renderOrders(filterStatus);
      } catch (err) {
        toast.error(err.message || 'Lỗi phân công giao hàng');
      }
    });
  });
};

window.addEventListener('DOMContentLoaded', async () => {
  await loadSidebar();
  const select = document.getElementById('statusFilter');
  const onStatusChange = async () => {
    await renderOrders(select.value);
  };
  select.addEventListener('change', onStatusChange);
  await renderOrders();
});
