import { getUser, redirectIfNotRole, initLogout } from '../utils/auth.js';
import { getCategories, getProducts } from '../api/menu.api.js';
import { toast } from '../utils/toast.js';

redirectIfNotRole('customer');

const user = getUser();

// Load navbar
async function loadNavbar() {
  try {
    const response = await fetch('../../components/navbar.html');
    const html = await response.text();
    document.getElementById('navbar').innerHTML = html;
    initLogout();
  } catch (error) {
    console.error('Failed to load navbar:', error);
  }
}

// Load categories
async function loadCategories() {
  try {
    const { data: categories } = await getCategories();
    const grid = document.getElementById('categoriesGrid');
    grid.innerHTML = categories.slice(0, 8).map(cat => `
      <div class="card category-card" style="text-align: center; cursor: pointer;" onclick="window.location.href='menu.html?category=${cat.id}'">
        <div style="padding: 2rem; font-size: 3rem;">${getCategoryIcon(cat.name)}</div>
        <h3 style="margin: 1rem 0; color: var(--dark);">${cat.name}</h3>
      </div>
    `).join('');
  } catch (error) {
    console.error('Failed to load categories:', error);
    document.getElementById('categoriesGrid').innerHTML = '<p style="text-align: center; color: var(--gray);">Không thể tải danh mục</p>';
  }
}

// Load featured products
async function loadFeaturedProducts() {
  try {
    const { data: products } = await getProducts({ limit: 8, featured: true });
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = products.map(product => `
      <div class="card product-card" onclick="window.location.href='menu.html?product=${product.id}'">
        <img src="${product.image || '../../assets/images/placeholder.jpg'}" alt="${product.name}" style="width: 100%; height: 180px; object-fit: cover;">
        <div class="product-card-body">
          <h4 style="margin-bottom: 0.5rem; color: var(--dark);">${product.name}</h4>
          <p style="color: var(--gray); font-size: 0.9rem; margin-bottom: 0.5rem;">${product.description || ''}</p>
          <div class="product-price">${formatPrice(product.price)} VND</div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Failed to load products:', error);
    document.getElementById('productsGrid').innerHTML = '<p style="text-align: center; color: var(--gray);">Không thể tải sản phẩm</p>';
  }
}

// Helper functions
function getCategoryIcon(name) {
  const icons = {
    'Burger': '🍔',
    'Pizza': '🍕',
    'Pasta': '🍝',
    'Salad': '🥗',
    'Drink': '🥤',
    'Dessert': '🍰'
  };
  return icons[name] || '🍽️';
}

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN').format(price);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadNavbar();
  loadCategories();
  loadFeaturedProducts();
});
