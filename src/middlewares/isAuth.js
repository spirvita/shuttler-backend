const { dataSource } = require('../db/data-source');
const appError = require('../utils/appError');
const { verifyJWT } = require('../utils/jwtUtils');
const logger = require('../utils/logger')('isAuth');

const isAuth = async (req, res, next) => {
  try {
    // Authorization: Bearer xxxxxxx.yyyyyyy.zzzzzzz
    // 確認token是否存在 & 取出token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      next(appError(401, '你尚未登入！'));
      return;
    }
    // 取出token
    const token = authHeader.split(' ')[1];
    // 驗證token
    const decoded = await verifyJWT(token);
    const currentUser = await dataSource.getRepository('Member').findOne({
      where: {
        id: decoded.id,
      },
    });
    if (!currentUser) {
      return next(appError(401, '無效的token'));
    }

    req.user = currentUser;
    next();
  } catch (error) {
    logger.error(error.message);
    next(error);
  }
};

module.exports = isAuth;
