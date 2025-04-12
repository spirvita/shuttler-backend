const pino = require('pino'); // pino logger
const pretty = require('pino-pretty'); // pino pretty

// 輸出log前先pretty化
module.exports = function getLogger(prefix, logLevel = 'debug') {
  return pino(
    pretty({
      level: logLevel,
      messageFormat: `[${prefix}]: {msg}`, // 設定訊息輸出格式，用[prefix]方便找log來源
      colorize: true,
      sync: true, // 設定同步輸出，預設是false。開發時可啟用
    }),
  );
};
