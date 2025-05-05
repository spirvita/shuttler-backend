const { dataSource } = require('../db/data-source');
const logger = require('../utils/logger')('Member');
const { isValidString } = require('../utils/validUtils');
const appError = require('../utils/appError');

const userController = {
  getMemberProfile: async (req, res, next) => {
    try {
      const { id } = req.user;
      const findUser = await dataSource.getRepository('Member').findOne({
        where: {
          id,
        },
      });

      res.status(200).json({
        status: 'success',
        data: {
          name: findUser.name,
          avatar: findUser.photo,
          email: findUser.email,
          preferredLocation: findUser.region,
          registerDate: new Date(`${findUser.created_at}`).toISOString().split('T')[0],
          level: findUser.skill_level,
          totalPoint: findUser.totalPoint, // TODO: 這邊要從點數table查詢
          attendCount: 0, // TODO: 這邊要從報名活動的資料庫查詢
        },
      });
    } catch (error) {
      logger.error('取得使用者資料錯誤:', error);
      next(error);
    }
  },
  updateMemberProfile: async (req, res, next) => {
    try {
      const { id } = req.user;
      const { name, email, preferredLocation, skillLevel } = req.body;

      if (!isValidString(name) || !isValidString(email)) {
        logger.warn('更新使用者資料錯誤:', '欄位未填寫正確');
        return next(appError(400, '欄位未填寫正確'));
      }
      // 檢查用戶是否存在
      const existingMember = await dataSource.getRepository('Member').findOne({
        where: {
          id,
        },
        select: ['id', 'name', 'email', 'region', 'skill_level'],
      });

      if (!existingMember) {
        logger.warn('更新使用者資料錯誤:', '使用者不存在');
        return next(appError(400, '更新使用者資料失敗'));
      }
      // 更新前檢查唯一欄位（如 email）是否與除了自己外的其他用戶衝突
      if (email && email !== existingMember.email) {
        const existingEmail = await dataSource.getRepository('Member').findOne({
          where: {
            email,
          },
        });

        if (existingEmail) {
          logger.warn('更新使用者資料錯誤:', '此 Email 已經註冊');
          return next(appError(409, '此 Email 已經註冊'));
        }
      }

      const updatedMember = await dataSource.getRepository('Member').update(
        { id },
        {
          name,
          email,
          region: preferredLocation,
          skill_level: skillLevel,
        },
      );
      if (updatedMember.affected === 0) {
        logger.warn('更新使用者資料錯誤:', '更新失敗');
        return next(appError(400, '更新使用者資料失敗'));
      }

      logger.info('更新使用者資料成功:', updatedMember.id);

      // 重新查詢更新後的使用者資料
      const updateData = await dataSource.getRepository('Member').findOne({
        where: {
          id,
        },
      });

      res.status(200).json({
        message: '更新成功',
        data: {
          id: updateData.id,
          name: updateData.name,
          email: updateData.email,
          preferredLocation: updateData.region,
          skillLevel: updateData.skill_level,
        },
      });
    } catch (error) {
      logger.error('更新使用者資料錯誤:', error);
      next(error);
    }
  },
};

module.exports = userController;
