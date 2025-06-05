module.exports = {
  MerchantID: process.env.NEWEBPAY_MERCHANT_ID, // 商店代號
  HashKey: process.env.NEWEBPAY_HASH_KEY, // HashKey
  HashIV: process.env.NEWEBPAY_HASH_IV, // HashIV
  Version: process.env.NEWEBPAY_VERSION || '2.0', // API版本
  paymentUrl: process.env.NEWEBPAY_PAYMENT_URL || 'https://ccore.newebpay.com/MPG/mpg_gateway', // 測試環境
  notifyUrl: process.env.NEWEBPAY_NOTIFY_URL, // 支付通知URL
  returnUrl: process.env.NEWEBPAY_RETURN_URL, // 支付完成返回URL
  clientBackUrl: process.env.NEWEBPAY_CLIENT_BACK_URL, // 返回商店URL
  RespondType: 'JSON', // 回傳格式
  itemDesc: '羽球活動點數', // 商品說明
};
