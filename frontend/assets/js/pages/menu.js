import { redirectIfNotRole } from '../utils/auth.js';
import { getMenu, addToCart } from '../api/order.api.js';
import { toast } from '../utils/toast.js';

redirectIfNotRole('customer');

const container = document.createElement('div');
container.className = 'container';
container.style.paddingTop = '2rem';
container.innerHTML = '<h1>Thực đơn</h1><div id="menuList" class="grid"></div>';
document.body.innerHTML = '';
document.body.appendChild(container);

const loadMenu = async () => {
  try {
    const { data } = await getMenu();
    const menuList = document.getElementById('menuList');
    if (!data.length) {
      menuList.innerHTML = '<p>Không có sản phẩm nào.</p>';
      return;
    }
    menuList.innerHTML = data.map(item => `
      <div class="card">
        <h3>${item.product_name}</h3>
        <p>${item.description || '<i>Không có mô tả</i>'}</p>
        <p><b>Giá:</b> ${item.base_price.toLocaleString('vi-VN')} ₫</p>
        <button data-id="${item.product_id}" class="btn btn-primary add-cart">Thêm vào giỏ</button>
      </div>
    `).join('');

    menuList.querySelectorAll('.add-cart').forEach(button => {
      button.addEventListener('click', async () => {
        const product_id = button.dataset.id;
        try {
          await addToCart({ product_id, quantity: 1 });
          toast.success('Đã thêm vào giỏ hàng');
        } catch (err) {
          toast.error(err.message || 'Lỗi thêm giỏ hàng');
        }
      });
    });
  } catch (err) {
    container.innerHTML = `<p style="color:red">Lỗi tải thực đơn: ${err.message}</p>`;
  }
};

loadMenu();
