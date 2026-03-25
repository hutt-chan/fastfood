import { redirectIfNotRole } from '../utils/auth.js';
import { getCart, updateCartItem, removeFromCart, placeOrder, clearCart } from '../api/order.api.js';
import { toast } from '../utils/toast.js';

redirectIfNotRole('customer');

const container = document.createElement('div');
container.className = 'container';
container.style.paddingTop = '2rem';
container.innerHTML = `
  <h1>Giỏ hàng</h1>
  <div id="cartArea"></div>
  <div style="margin-top:1rem;"><button id="checkoutBtn" class="btn btn-success">Xác nhận đặt hàng</button></div>
`;

document.body.innerHTML = '';
document.body.appendChild(container);

const formatCurrency = v => Number(v).toLocaleString('vi-VN') + ' ₫';

const loadCart = async () => {
  try {
    const { data } = await getCart();
    const cartArea = document.getElementById('cartArea');
    if (!data.items || data.items.length === 0) {
      cartArea.innerHTML = '<p>Giỏ hàng đang trống.</p>';
      return;
    }
    let total = 0;
    cartArea.innerHTML = `
      <table class="table"><thead><tr><th>Sản phẩm</th><th>Số lượng</th><th>Đơn giá</th><th>Thành tiền</th><th></th></tr></thead>
      <tbody>${data.items.map(item => {
        const sub = item.quantity * item.unit_price;
        total += sub;
        return `<tr>
          <td>${item.product_name || item.product_id}</td>
          <td><input type="number" min="1" value="${item.quantity}" data-product="${item.product_id}" class="qty-input" style="width:70px"></td>
          <td>${formatCurrency(item.unit_price)}</td>
          <td>${formatCurrency(sub)}</td>
          <td><button data-product="${item.product_id}" class="btn btn-danger btn-sm remove-item">Xóa</button></td>
        </tr>`;
      }).join('')}</tbody></table>
      <p><strong>Tổng:</strong> ${formatCurrency(total)}</p>
      <button id="clearCartBtn" class="btn btn-warning">Xóa giỏ</button>
    `;
    cartArea.querySelectorAll('.qty-input').forEach(input => {
      input.addEventListener('change', async (e) => {
        const product_id = e.target.dataset.product;
        const qty = Number(e.target.value);
        if (qty <= 0) return;
        try {
          await updateCartItem(product_id, qty);
          toast.success('Cập nhật số lượng thành công');
          loadCart();
        } catch (err) {
          toast.error(err.message || 'Lỗi cập nhật');
        }
      });
    });

    cartArea.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', async () => {
        const product_id = btn.dataset.product;
        try {
          await removeFromCart(product_id);
          toast.success('Xóa sản phẩm thành công');
          loadCart();
        } catch (err) {
          toast.error(err.message || 'Lỗi xóa');
        }
      });
    });

    document.getElementById('clearCartBtn').addEventListener('click', async () => {
      if (!confirm('Xóa toàn bộ giỏ hàng?')) return;
      await clearCart();
      toast.success('Đã xóa giỏ hàng');
      loadCart();
    });
  } catch (err) {
    container.innerHTML = `<p style="color:red">Lỗi tải giỏ hàng: ${err.message}</p>`;
  }
};

loadCart();

document.getElementById('checkoutBtn').addEventListener('click', async () => {
  const address = prompt('Nhập địa chỉ giao hàng (bắt buộc):');
  if (!address) return toast.error('Bạn phải nhập địa chỉ giao hàng');
  try {
    await placeOrder({ store_id: 1, delivery_address_id: 1, note: '', delivery_fee: 0 });
    toast.success('Đã đặt hàng thành công');
    loadCart();
    window.location.href = 'orders.html';
  } catch (err) {
    toast.error(err.message || 'Lỗi đặt hàng');
  }
});
