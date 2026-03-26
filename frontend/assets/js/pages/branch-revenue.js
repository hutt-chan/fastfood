import { redirectIfNotRole, initLogout } from '../utils/auth.js';
import { getRevenue } from '../api/branch.api.js';
import { toast } from '../utils/toast.js';
import { getLocalDateString } from '../utils/format.js';

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

function formatDate(d) {
  const dt = new Date(d);
  return dt.toLocaleDateString('vi-VN');
}

async function renderRevenueChart(from, to) {
  try {
    const { data } = await getRevenue({ from, to });
    const rows = data || [];
    const container = document.getElementById('revenueTable');
    if (!rows.length) {
      container.innerHTML = '<p>Không có dữ liệu doanh thu trong khoảng này.</p>';
      return;
    }

    const total = rows.reduce((sum, r) => sum + Number(r.revenue || 0), 0);
    const rowsHtml = rows.map((r, idx) => `
      <tr class="revenue-row">
        <td>${idx + 1}</td>
        <td>${formatDate(r.date)}</td>
        <td>${Number(r.revenue).toLocaleString('vi-VN')} ₫</td>
      </tr>
    `).join('');

    container.innerHTML = `
      <div class="stat-card" style="margin-bottom:1rem; padding:1rem; background: var(--light); border: 1px solid var(--border); border-radius: var(--radius);">
        <div class="stat-value">${Number(total).toLocaleString('vi-VN')} ₫</div>
        <div class="stat-label">Tổng doanh thu</div>
      </div>
      <table class="table">
        <thead><tr><th>#</th><th>Ngày</th><th>Doanh thu</th></tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    `;
  } catch (err) {
    console.error(err);
    toast.error('Lỗi tải báo cáo doanh thu');
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  await loadSidebar();
  const today = new Date();
  const from = new Date();
  from.setDate(today.getDate() - 6);

  document.getElementById('fromDate').value = getLocalDateString(from);
  document.getElementById('toDate').value = getLocalDateString(today);

  const update = async () => {
    const fromValue = document.getElementById('fromDate').value;
    const toValue = document.getElementById('toDate').value + 'T23:59:59';
    await renderRevenueChart(fromValue, toValue);
  };

  document.getElementById('btnLoad').addEventListener('click', update);
  await update();
});