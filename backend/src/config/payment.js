module.exports = {
  vnpay: {
    tmnCode:    process.env.VNPAY_TMN_CODE,
    hashSecret: process.env.VNPAY_HASH_SECRET,
    url:        'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    returnUrl:  process.env.VNPAY_RETURN_URL,
  },
  momo: {
    partnerCode: process.env.MOMO_PARTNER_CODE,
    accessKey:   process.env.MOMO_ACCESS_KEY,
    secretKey:   process.env.MOMO_SECRET_KEY,
    endpoint:    'https://test-payment.momo.vn/v2/gateway/api/create',
  },
  zalopay: {
    appId:     process.env.ZALOPAY_APP_ID,
    key1:      process.env.ZALOPAY_KEY1,
    key2:      process.env.ZALOPAY_KEY2,
    endpoint:  'https://sb.zalopay.vn/v001/tpe/createorder',
  },
};
