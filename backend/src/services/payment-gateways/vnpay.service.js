const crypto = require('crypto');
const { vnpay } = require('../../config/payment');

const createPaymentUrl = (order_id, amount, orderInfo, ipAddr) => {
  const date   = new Date();
  const txnRef = `${order_id}_${Date.now()}`;
  const params = new URLSearchParams({
    vnp_Version:    '2.1.0',
    vnp_Command:    'pay',
    vnp_TmnCode:    vnpay.tmnCode,
    vnp_Amount:     String(amount * 100),
    vnp_CurrCode:   'VND',
    vnp_TxnRef:     txnRef,
    vnp_OrderInfo:  orderInfo,
    vnp_OrderType:  'other',
    vnp_Locale:     'vn',
    vnp_ReturnUrl:  vnpay.returnUrl,
    vnp_IpAddr:     ipAddr,
    vnp_CreateDate: date.toISOString().replace(/[-:T.Z]/g,'').slice(0,14),
  });
  params.sort();
  const signed = crypto.createHmac('sha512', vnpay.hashSecret).update(params.toString()).digest('hex');
  return `${vnpay.url}?${params}&vnp_SecureHash=${signed}`;
};

module.exports = { createPaymentUrl };
