/**
 * 解析藍新金流的 PayTime 格式
 * @param {string} payTime - 藍新金流回傳的時間字串 (例如: "2025-06-0523:01:54")
 * @returns {Date} JavaScript Date 物件
 */
const parseNewebpayTime = (payTime) => {
  if (!payTime) {
    return null;
  }

  // 處理可能的格式：
  // 1. "2025-06-0523:01:54" (日期和時間之間沒有空格)
  // 2. "2025-06-05 23:01:54" (正常格式)

  let formattedTime = payTime;

  // 使用正則表達式檢查並修正格式
  // 匹配: YYYY-MM-DDHH:mm:ss 格式
  const malformedPattern = /^(\d{4}-\d{2}-\d{2})(\d{2}:\d{2}:\d{2})$/;
  const match = payTime.match(malformedPattern);

  if (match) {
    // 在日期和時間之間加入空格
    formattedTime = `${match[1]} ${match[2]}`;
  }

  // 另一種可能的格式：檢查第10個字符是否不是空格或T
  if (payTime.length >= 19 && payTime[10] !== ' ' && payTime[10] !== 'T') {
    // 在第10個位置插入空格
    formattedTime = payTime.slice(0, 10) + ' ' + payTime.slice(10);
  }

  // 建立 Date 物件
  const date = new Date(formattedTime);

  // 驗證日期是否有效
  if (isNaN(date.getTime())) {
    throw new Error(`無效的日期時間格式: ${payTime}`);
  }

  return date;
};

/**
 * 將日期轉換為 PostgreSQL timestamp 格式
 * @param {Date|string} date - Date 物件或日期字串
 * @returns {string} PostgreSQL timestamp 格式 (YYYY-MM-DD HH:mm:ss)
 */
const toPostgresTimestamp = (date) => {
  if (!date) {
    return null;
  }

  const d = date instanceof Date ? date : new Date(date);

  if (isNaN(d.getTime())) {
    throw new Error(`無效的日期: ${date}`);
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

module.exports = {
  parseNewebpayTime,
  toPostgresTimestamp,
};
