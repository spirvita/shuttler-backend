module.exports = {
  MerchantID: process.env.NEWEBPAY_MERCHANT_ID, // 商店代號
  HashKey: process.env.NEWEBPAY_HASH_KEY, // HashKey
  HashIV: process.env.NEWEBPAY_HASH_IV, // HashIV
  Version: process.env.NEWEBPAY_VERSION || '2.0', // API版本
  notifyUrl: process.env.NEWEBPAY_NOTIFY_URL, // 支付通知URL
  returnUrl: process.env.NEWEBPAY_RETURN_URL, // 支付完成返回URL
  RespondType: 'JSON', // 回傳格式
  itemDesc: '羽球活動點數', // 商品說明
};
