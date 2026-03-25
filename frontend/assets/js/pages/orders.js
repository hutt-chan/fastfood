import { redirectIfNotRole } from '../utils/auth.js';
import { getOrders, cancelOrder } from '../api/order.api.js';
import { toast } from '../utils/toast.js';

redirectIfNotRole('customer');

const container = document.createElement('div');
container.className = 'container';
container.style.paddingTop = '2rem';
container.innerHTML = '<h1>Đơn hàng của tôi</h1><div id="ordersArea"></div>';

document.body.innerHTML = '';
document.body.appendChild(container);

const loadOrders = async () => {
  try {
    const { data } = await getOrders();
    const ordersArea = document.getElementById('ordersArea');
    if (!data.length) {
      ordersArea.innerHTML = '<p>Chưa có đơn hàng.</p>';
      return;
    }
    ordersArea.innerHTML = data.map(order => `
      <div class="card" style="margin-bottom:.75rem">
        <h3>${order.order_code || `#${order.order_id}`}</h3>
        <p>Trạng thái: <strong>${order.status}</strong></p>
        <p>Tổng: ${Number(order.total_amount).toLocaleString('vi-VN')} ₫</p>
        <p>Ngày: ${new Date(order.created_at).toLocaleString()}</p>
        <p><button data-id="${order.order_id}" class="btn btn-danger btn-sm cancel-order" ${order.status !== 'pending' && order.status !== 'confirmed' ? 'disabled' : ''}>Hủy đơn</button></p>
      </div>`).join('');
    ordersArea.querySelectorAll('.cancel-order').forEach(btn => {
      btn.addEventListener('click', async () => {
        const order_id = btn.dataset.id;
        if (!confirm('Bạn có chắc muốn hủy đơn?')) return;
        try {
          await cancelOrder(order_id, 'Hủy bởi khách');
          toast.success('Đã hủy đơn');
          loadOrders();
        } catch (err) {
          toast.error(err.message || 'Lỗi hủy đơn');
        }
      });
    });
  } catch (err) {
    container.innerHTML = `<p style="color:red">Lỗi tải đơn hàng: ${err.message}</p>`;
  }
};

loadOrders();
