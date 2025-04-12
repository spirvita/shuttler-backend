const { dataSource } = require('../db/data-source');
const logger = require('../utils/logger')('Member');
const { isValidString } = require('../utils/validUtils');
const appError = require('../utils/appError');

const memberController = {
  async getMemberProfile(req, res, next) {
    try {
      const { id } = req.user;
      if (!isValidString(id)) {
        return next(appError(400, '欄位未填寫正確'));
      }
      const findUser = await dataSource.getRepository('Member').findOne({
        where: {
          id,
        },
      });

      res.status(200).json({
        status: 'success',
        data: {
          //
        },
      });
    } catch (error) {
      logger.error('取得使用者資料錯誤:', error);
      next(error);
    }
  },
};

module.exports = memberController;
