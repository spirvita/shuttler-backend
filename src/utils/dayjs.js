const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc); // 引入 UTC 插件
dayjs.extend(timezone); // 引入時區插件

dayjs.tz.setDefault('Asia/Taipei'); // 設定預設時區為台灣

module.exports = dayjs;
