import { redirectIfNotRole, initLogout } from '../utils/auth.js';
import { getBranchOrders, assignDelivery, updateOrderStatus, rejectOrder, getRevenue } from '../api/branch.api.js';
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
    pending: '⏳ Chờ',
    confirmed: '📋 Xác nhận',
    preparing: '🍳 Chuẩn bị',
    ready: '📦 Sẵn sàng',
    delivering: '🚚 Đang giao',
    delivered: '✔️ Đã giao',
    cancelled: '❌ Đã hủy'
  };
  return map[status] || status;
}

function getBadgeClass(status) {
  const map = { pending: 'badge-pending', confirmed: 'badge-confirmed', preparing: 'badge-preparing',
    ready: 'badge-ready', delivering: 'badge-delivering', delivered: 'badge-delivered', cancelled: 'badge-cancelled'
  };
  return map[status] || 'badge-pending';
}

function orderActions(order) {
  const updateSelect = `
    <select class="status-select" data-id="${order.order_id}">
      <option value=""> Cập nhật trạng thái </option>
      <option value="confirmed">✅ Đã xác nhận</option>
      <option value="preparing">🍳 Chuẩn bị</option>
      <option value="ready">📦 Sẵn sàng</option>
      <option value="delivering">🚚 Đang giao</option>
      <option value="delivered">✔️ Đã giao</option>
      <option value="cancelled">❌ Đã hủy</option>
    </select>
  `;
  const rejectButton = `<button class="btn-small reject-btn" data-id="${order.order_id}">🗑️ Từ chối</button>`;
  return `<div class="action-cell">${updateSelect} ${rejectButton}</div>`;
}

const renderOrders = async (filterStatus = '') => {
  const allOrders = await fetchOrders();
  const orders = filterStatus ? allOrders.filter((o) => o.status === filterStatus) : allOrders;
  const container = document.getElementById('orderTable');
  if (!orders.length) {
    container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">Không có đơn hàng nào.</p>';
    return;
  }

  container.innerHTML = `
    <table class="order-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Mã đơn</th>
          <th>Khách hàng</th>
          <th>Tổng tiền</th>
          <th>Trạng thái</th>
          <th>Ngày tạo</th>
          <th>Cập nhật trạng thái</th>
          <th>Phân công giao</th>
        </tr>
      </thead>
      <tbody>
        ${orders.map((order, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td><strong>#${order.order_code || order.order_id}</strong></td>
            <td>${order.customer_id || '-'}</td>
            <td><strong>${Number(order.total_amount).toLocaleString('vi-VN')} ₫</strong></td>
            <td><span class="badge-status ${getBadgeClass(order.status)}">${statusLabel(order.status)}</span></td>
            <td>${new Date(order.created_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</td>
            <td>${orderActions(order)}</td>
            <td>
              <div class="assign-row">
                <input type="number" min="1" placeholder="ID NV" class="delivery-input" data-id="${order.order_id}" />
                <button class="btn-small assign-btn" data-id="${order.order_id}">👤 Giao</button>
              </div>
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
        toast.success('✅ Cập nhật trạng thái thành công');
        await renderOrders(filterStatus);
      } catch (err) {
        toast.error('❌ ' + (err.message || 'Lỗi cập nhật trạng thái'));
      }
    });
  });

  document.querySelectorAll('.assign-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const order_id = btn.dataset.id;
      const input = document.querySelector(`.delivery-input[data-id="${order_id}"]`);
      const delivery_person_id = input.value;
      if (!delivery_person_id) {
        toast.error('⚠️ Vui lòng nhập ID nhân viên giao hàng');
        return;
      }

      try {
        await assignDelivery(order_id, Number(delivery_person_id));
        toast.success('✅ Phân công giao hàng thành công');
        await renderOrders(filterStatus);
      } catch (err) {
        toast.error('❌ ' + (err.message || 'Lỗi phân công giao hàng'));
      }
    });
  });

  document.querySelectorAll('.reject-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const order_id = btn.dataset.id;
      const reason = prompt('📝 Nhập lý do từ chối (hết nguyên liệu/quá tải/khác):');
      if (!reason) {
        toast.info('ℹ️ Yêu cầu nhập lý do từ chối');
        return;
      }
      try {
        await rejectOrder(order_id, reason);
        toast.success('✅ Đơn hàng đã bị từ chối, khách hàng được thông báo');
        await renderOrders(filterStatus);
      } catch (err) {
        toast.error('❌ ' + (err.message || 'Lỗi từ chối đơn hàng'));
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
