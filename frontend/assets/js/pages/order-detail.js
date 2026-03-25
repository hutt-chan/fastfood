import { redirectIfNotRole } from '../utils/auth.js';
import { getOrderDetail } from '../api/order.api.js';
import { toast } from '../utils/toast.js';

redirectIfNotRole('customer');

const params = new URLSearchParams(window.location.search);
const orderId = params.get('id');
const detailArea = document.getElementById('detailArea');

const formatCurrency = value => Number(value).toLocaleString('vi-VN') + ' ₫';

const render = (order) => {
  if (!order) {
    detailArea.innerHTML = '<p>Không tìm thấy đơn hàng.</p>';
    return;
  }
  detailArea.innerHTML = `
    <div class="card" style="padding:1rem;">
      <p><strong>Mã đơn:</strong> ${order.order_code || order.order_id}</p>
      <p><strong>Trạng thái:</strong> ${order.status}</p>
      <p><strong>Tổng tiền:</strong> ${formatCurrency(order.total_amount)}</p>
      <p><strong>Địa chỉ:</strong> ${order.delivery_address_id || 'Chưa có'}</p>
      <p><strong>Ghi chú:</strong> ${order.note || '-'}</p>
      <h3>Sản phẩm</h3>
      <ul>${order.items.map(i => `<li>${i.product_name || i.product_id} x${i.quantity} = ${formatCurrency(i.unit_price * i.quantity)}</li>`).join('')}</ul>
    </div>
  `;
};

if (!orderId) {
  detailArea.innerHTML = '<p>Mã đơn hàng không hợp lệ.</p>';
} else {
  getOrderDetail(orderId)
    .then(({ data }) => render(data))
    .catch(err => {
      toast.error(err.message || 'Lỗi tải dữ liệu');
      detailArea.innerHTML = '<p>Không thể tải đơn hàng.</p>';
    });
}
