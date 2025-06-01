const { dataSource } = require('../db/data-source');
const logger = require('../utils/logger')('Points');
const appError = require('../utils/appError');

const pointsController = {
  getPoints: async (req, res, next) => {
    try {
      const pointsRepo = dataSource.getRepository('PointsPlan');
      const points = await pointsRepo.find({ select: ['points', 'value'] });
      if (!points) {
        logger.warn('取得點數資料錯誤:', '點數資料不存在');
        return next(appError(400, '點數資料不存在'));
      }
      res.status(200).json({
        status: 'success',
        data: points,
      });
    } catch (error) {
      logger.error('取得點數資料錯誤:', error);
      appError(500, '取得點數資料錯誤');
      next(error);
    }
  },
};

module.exports = pointsController;
