#!/usr/bin/env node

const http = require('http');
const config = require('../src/config/index');
const app = require('../src/app');
const logger = require('../src/utils/logger')('www');
const { dataSource } = require('../src/db/data-source');

const port = config.get('web.port');
app.set('port', port);
const server = http.createServer(app);

/**
 * server error handler
 */
function onError(error) {
  if (error.syscall !== 'listen') throw error;
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      logger.error(`exception on ${bind}: ${error.code}`);
      process.exit(1);
  }
}

server.on('error', onError);
server.listen(port, async () => {
  try {
    await dataSource.initialize();
    logger.info('資料庫連線成功');
    logger.info(`伺服器運作中. port: ${port}`);
  } catch (error) {
    logger.error(`資料庫連線失敗: ${error.message}`);
    process.exit(1);
  }
});
