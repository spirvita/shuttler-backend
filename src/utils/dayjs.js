const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');

dayjs.extend(utc); // 引入 UTC 插件
dayjs.extend(timezone); // 引入時區插件
dayjs.extend(isSameOrBefore); // 引入 isSameOrBefore 插件
dayjs.extend(isSameOrAfter); // 引入 isSameOrAfter 插件

dayjs.tz.setDefault('Asia/Taipei'); // 設定預設時區為台灣

module.exports = dayjs;
