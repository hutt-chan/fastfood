/**
 * Sinh mã đơn hàng dạng FF-YYYYMMDD-XXXX
 * VD: FF-20241201-0042
 */
const generateOrderCode = (seq) => {
  const d   = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  return `FF-${ymd}-${String(seq).padStart(4,'0')}`;
};

module.exports = generateOrderCode;
