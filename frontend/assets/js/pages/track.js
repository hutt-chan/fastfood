import { redirectIfNotRole } from '../utils/auth.js';
import { getOrderDetail } from '../api/order.api.js';
import { toast } from '../utils/toast.js';

redirectIfNotRole('customer');

const form = document.getElementById('trackForm');
const result = document.getElementById('trackResult');

const formatCurrency = value => Number(value).toLocaleString('vi-VN') + ' ₫';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const orderId = document.getElementById('orderId').value.trim();
  if (!orderId) return toast.error('Vui lòng nhập mã đơn hàng');
  try {
    const { data } = await getOrderDetail(orderId);
    result.innerHTML = `
      <div class="card" style="padding:1rem;">
        <p><b>Mã đơn:</b> ${data.order_code || data.order_id}</p>
        <p><b>Trạng thái:</b> ${data.status}</p>
        <p><b>Tổng tiền:</b> ${formatCurrency(data.total_amount)}</p>
        <p><b>Địa chỉ:</b> ${data.delivery_address_id || 'Chưa cung cấp'}</p>
        <p><b>Ghi chú:</b> ${data.note || '-'}</p>
        <h3>Danh sách sản phẩm</h3>
        <ul>${data.items.map(i => `<li>${i.product_name || i.product_id} x${i.quantity} = ${formatCurrency(i.unit_price * i.quantity)}</li>`).join('')}</ul>
      </div>
    `;
  } catch (err) {
    toast.error(err.message || 'Không tìm thấy mã đơn');
    result.innerHTML = '<p>Mã đơn không tồn tại hoặc lỗi server.</p>';
  }
});