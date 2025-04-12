const jwt = require('jsonwebtoken');
const config = require('../config/index');
const appError = require('./appError');

/**
 * 產生 JWT token
 * @param {Object} payload - 要加密的資料
 * @returns {string} - JWT token
 */
const generateJWT = (payload) => {
  return jwt.sign(payload, config.get('jwt.jwtSecret'), {
    expiresIn: config.get('jwt.jwtExpiresDay'),
  });
};

/**
 * 驗證 JWT token
 * @param {string} token - 要驗證的 token
 * @returns {Promise} - 驗證結果
 */
const verifyJWT = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.get('jwt.jwtSecret'), (err, decoded) => {
      if (err) {
        // reject(err)
        switch (err.name) {
          case 'TokenExpiredError':
            reject(appError(401, 'Token 已過期'));
            break;
          default:
            reject(appError(401, '無效的 token'));
            break;
        }
      } else {
        resolve(decoded);
      }
    });
  });
};

module.exports = {
  generateJWT,
  verifyJWT,
};
