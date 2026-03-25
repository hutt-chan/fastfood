import { redirectIfNotRole, initLogout } from '../utils/auth.js';
import { getRevenue } from '../api/branch.api.js';
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
      <tr>
        <td>${idx + 1}</td>
        <td>${formatDate(r.date)}</td>
        <td>${Number(r.revenue).toLocaleString('vi-VN')} ₫</td>
      </tr>
    `).join('');

    container.innerHTML = `
      <div class="card" style="padding:1rem; margin-bottom:1rem;">
        <h4>Tổng doanh thu: ${Number(total).toLocaleString('vi-VN')} ₫</h4>
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

  document.getElementById('fromDate').value = from.toISOString().split('T')[0];
  document.getElementById('toDate').value = today.toISOString().split('T')[0];

  const update = async () => {
    const fromValue = document.getElementById('fromDate').value;
    const toValue = document.getElementById('toDate').value;
    await renderRevenueChart(fromValue, toValue);
  };

  document.getElementById('btnLoad').addEventListener('click', update);
  await update();
});