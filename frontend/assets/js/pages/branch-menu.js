import { redirectIfNotRole, initLogout } from '../utils/auth.js';
import { getBranchMenu, addMenuItem, updateMenuItem, deleteMenuItem } from '../api/branch.api.js';
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

const formatMoney = (value) => Number(value || 0).toLocaleString('vi-VN');

// ===== MODAL QUẢN LÝ =====
function showEditModal(item) {
  const modal = document.getElementById('editMenuModal');
  const form = document.getElementById('editMenuFormModal');
  
  form.product_name.value = item.product_name || '';
  form.description.value = item.description || '';
  form.base_price.value = item.price || '';
  form.price_override.value = item.price_override || '';
  form.is_available.checked = item.is_available;
  
  form.dataset.productId = item.product_id;
  modal.style.display = 'flex';
}

function hideEditModal() {
  const modal = document.getElementById('editMenuModal');
  modal.style.display = 'none';
  document.getElementById('editMenuFormModal').reset();
}

async function renderMenu() {
  try {
    const { data } = await getBranchMenu();
    const menuItems = data || [];
    const container = document.getElementById('menuList');

    if (!menuItems.length) {
      container.innerHTML = '<div class="card" style="text-align: center; padding: 2rem; color: #999;"><p>📭 Chưa có sản phẩm nào trong thực đơn.</p></div>';
      return;
    }

    container.innerHTML = `
      <div class="card">
        <h5 style="font-size: 1.1rem; margin-bottom: 1.5rem; color: #333;">📝 Danh Sách Thực Đơn Chi Nhánh</h5>
        <table class="menu-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên Món</th>
              <th>Mô Tả</th>
              <th>Giá Gốc</th>
              <th>Giá Hiển Thị</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            ${menuItems.map((item, idx) => `
              <tr>
                <td><strong>${idx + 1}</strong></td>
                <td><strong>${item.product_name}</strong></td>
                <td style="max-width:200px; color: #666; font-size: .9rem;">${item.description || '—'}</td>
                <td>${formatMoney(item.price)} ₫</td>
                <td><strong>${item.price_override ? formatMoney(item.price_override) + ' ₫' : formatMoney(item.price) + ' ₫'}</strong></td>
                <td>
                  <span class="badge-info ${item.is_available ? 'badge-active' : 'badge-inactive'}">
                    ${item.is_available ? '✅ Hiển thị' : '⛔ Ẩn'}
                  </span>
                </td>
                <td>
                  <div class="actions">
                    <button class="btn btn-warning btn-sm edit-btn" data-id="${item.product_id}" title="Chỉnh sửa">✏️</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${item.product_id}" title="Xóa">🗑️</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // ===== EVENT: EDIT BTN =====
    document.querySelectorAll('.edit-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const product_id = btn.dataset.id;
        const item = menuItems.find(m => m.product_id == product_id);
        if (item) showEditModal(item);
      });
    });

    // ===== EVENT: DELETE BTN =====
    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const product_id = btn.dataset.id;
        if (!confirm('🗑️ Xóa món này khỏi thực đơn?')) return;
        try {
          await deleteMenuItem(product_id);
          toast.success('Xóa món thành công ✓');
          await renderMenu();
        } catch (err) {
          toast.error(err.message || 'Lỗi xóa món');
        }
      });
    });
  } catch (err) {
    console.error(err);
    toast.error('Lỗi tải dữ liệu thực đơn');
  }
}

async function initAddMenuForm() {
  const formAdd = document.getElementById('branchMenuForm');
  formAdd.addEventListener('submit', async (e) => {
    e.preventDefault();
    const product_id = formAdd.product_id.value;
    const product_name = formAdd.product_name.value;
    const description = formAdd.description.value;
    const base_price = formAdd.base_price.value;
    const price_override = formAdd.price_override.value;
    const is_available = formAdd.is_available.checked;

    if (!product_id) {
      toast.error('⚠️ Product ID là bắt buộc');
      return;
    }

    try {
      await addMenuItem({
        product_id: Number(product_id),
        price_override: price_override ? Number(price_override) : null,
        is_available
      });
      toast.success('✅ Thêm món mới thành công');
      formAdd.reset();
      formAdd.is_available.checked = true;
      await renderMenu();
    } catch (err) {
      toast.error(err.message || 'Lỗi thêm món');
    }
  });
}

function initEditModal() {
  const modal = document.getElementById('editMenuModal');
  const formEdit = document.getElementById('editMenuFormModal');
  const cancelBtn = document.getElementById('cancelEditBtn');

  // Cancel button
  cancelBtn.addEventListener('click', hideEditModal);

  // Click outside modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) hideEditModal();
  });

  // Submit form
  formEdit.addEventListener('submit', async (e) => {
    e.preventDefault();
    const product_id = formEdit.dataset.productId;
    const price_override = formEdit.price_override.value;
    const is_available = formEdit.is_available.checked;

    try {
      await updateMenuItem(product_id, {
        price_override: price_override ? Number(price_override) : null,
        is_available
      });
      toast.success('Cập nhật món thành công ✓');
      hideEditModal();
      await renderMenu();
    } catch (err) {
      toast.error(err.message || 'Lỗi cập nhật món');
    }
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  await loadSidebar();
  await renderMenu();
  await initAddMenuForm();
  initEditModal();
});