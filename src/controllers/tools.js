const { dataSource } = require('../db/data-source');
const logger = require('../utils/logger')('Tools');
const appError = require('../utils/appError');

const toolsController = {
  addUserPoints: async (req, res, next) => {
    try {
      const { email, points } = req.body;
      if (!email || !points) {
        return next(appError(400, 'User email and points are required'));
      }

      const userRepo = dataSource.getRepository('Members');
      const user = await userRepo.findOne({ where: { email } });

      if (!user) {
        return next(appError(404, 'User not found'));
      }

      user.points = (user.points || 0) + points;
      await userRepo.save(user);

      res.status(200).json({
        status: 'success',
        data: {
          email,
          points: user.points,
        },
      });
    } catch (error) {
      logger.error('Error adding user points:', error);
      next(appError(500, 'Internal server error'));
    }
  },
  addPointsPlan: async (req, res, next) => {
    try {
      const { points, value } = req.body;
      if (!points || !value) {
        return next(appError(400, 'Points, value are required'));
      }

      const pointsPlanRepo = dataSource.getRepository('PointsPlan');
      const newPlan = pointsPlanRepo.create({ points, value });
      await pointsPlanRepo.save(newPlan);

      res.status(201).json({
        status: 'success',
        data: {
          id: newPlan.id,
          points: newPlan.points,
          value: newPlan.value,
        },
      });
    } catch (error) {
      logger.error('Error adding points plan:', error);
      next(appError(500, 'Internal server error'));
    }
  },
  deletePointsPlan: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) {
        return next(appError(400, 'Points plan ID is required'));
      }

      const pointsPlanRepo = dataSource.getRepository('PointsPlan');
      const plan = await pointsPlanRepo.findOne({ where: { id } });

      if (!plan) {
        return next(appError(404, 'Points plan not found'));
      }

      await pointsPlanRepo.remove(plan);
      logger.info(`Points plan with ID ${id} deleted successfully`);

      const allPlans = await pointsPlanRepo.find({ select: ['id', 'points', 'value'] });

      res.status(200).json({
        status: 'success',
        message: 'Points plan deleted successfully',
        data: allPlans,
      });
    } catch (error) {
      logger.error('Error deleting points plan:', error);
      next(appError(500, 'Internal server error'));
    }
  },
};

module.exports = toolsController;
