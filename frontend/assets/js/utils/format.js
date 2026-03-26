export const formatVND = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export const formatDate = (iso) =>
  new Date(iso).toLocaleString('vi-VN');

export const getLocalDateString = (date = new Date()) =>
  date.toLocaleDateString('en-CA');

export const orderStatusLabel = {
  pending:    '⏳ Chờ xác nhận',
  confirmed:  '✅ Đã xác nhận',
  preparing:  '👨‍🍳 Đang chế biến',
  ready:      '🍔 Sẵn sàng',
  delivering: '🛵 Đang giao',
  delivered:  '🎉 Đã giao',
  cancelled:  '❌ Đã hủy',
};
