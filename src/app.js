const express = require('express');
const cors = require('cors');
const path = require('path');
const pinoHttp = require('pino-http');
const passport = require('./config/passport');
const logger = require('./utils/logger')('app');

const v1Routes = require('./routes/v1');
// const v2Routes = require('./routes/v2');

const app = express();
// middleware
app.use(cors()); // 啟用 CORS
app.use(express.json()); // parser JSON request
app.use(express.urlencoded({ extended: false })); // parser URL encoded request
app.use(passport.initialize()); // 啟用 passport
app.use(
  pinoHttp({
    logger, // 使用自訂義的 pino logger
    serializers: {
      // serializers自訂req在log的格式
      req(req) {
        req.body = req.raw.body;
        return req;
      },
    },
  }),
);
app.use(express.static(path.join(__dirname, '../public'))); // 提供靜態文件service
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// api router
app.use('/api/v1', v1Routes);
// app.use('/api/v2', v2Routes);

// 404 middleware
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: '無此路由',
  });
});

// 500 middleware
app.use((err, req, res, next) => {
  req.log.error(err);
  const statusCode = err.status || 500; // 400, 409, 500 ...
  res.status(statusCode).json({
    status: statusCode === 500 ? 'error' : 'failed',
    message: err.message || '伺服器錯誤',
  });
});

module.exports = app;
