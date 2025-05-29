const { dataSource } = require('../db/data-source');
const logger = require('../utils/logger')('Member');
const { isValidString, isValidEmail } = require('../utils/validUtils');
const appError = require('../utils/appError');

const userController = {
  getMemberActivities: async (req, res, next) => {
    try {
      const { id } = req.user;
      const activityLevelsRepo = dataSource.getRepository('ActivityLevels');
      const cityRepo = dataSource.getRepository('Cities');
      const activitiesRegisterRepo = dataSource.getRepository('ActivitiesRegister');
      const activitiesRegisters = await activitiesRegisterRepo.find({
        where: {
          member_id: id,
        },
        relations: ['member', 'activity'],
      });
      if (!activitiesRegisters || activitiesRegisters.length === 0) {
        return next(appError(404, '查無活動資料'));
      }

      const data = [];
      for (const activity of activitiesRegisters) {
        const start = new Date(activity.activity.start_time);
        const end = new Date(activity.activity.end_time);
        const date = start.toISOString().split('T')[0];
        const startTime = start.toISOString().split('T')[1].slice(0, 5);
        const endTime = end.toISOString().split('T')[1].slice(0, 5);

        const cityData = await cityRepo.findOne({
          where: {
            zip_code: activity.activity.zip_code,
          },
        });

        const levels = await activityLevelsRepo.find({
          where: { activity: { id: activity.activity.id } },
          relations: ['level'],
        });
        const level = levels.map((al) => al.level.name);

        let activityStatus;
        if (activity.activity.status === 'suspended') {
          activityStatus = 'suspended';
        } else if (activity.activity.status === 'cancelled') {
          activityStatus = 'cancelled';
        } else if (activity.activity.status === 'published') {
          const now = new Date();
          activityStatus = end < now ? 'ended' : 'registered';
        }

        data.push({
          activityId: activity.activity.id,
          name: activity.activity.name,
          date,
          startTime,
          endTime,
          venueName: activity.activity.venue_name,
          city: cityData.city,
          district: cityData.district,
          address: activity.activity.address,
          level,
          participantCount: activity.activity.participant_count,
          bookedCount: activity.activity.booked_count,
          contactAvatar: activity.member.photo,
          contactName: activity.activity.contact_name,
          contactPhone: activity.activity.contact_phone,
          contactLine: activity.activity.contact_line,
          points: activity.activity.points,
          status: activityStatus,
        });
      }
      res.status(200).json({
        message: '成功',
        data,
      });
    } catch (error) {
      logger.error('取得使用者活動錯誤:', error);
      next(error);
    }
  },
  getMemberProfile: async (req, res, next) => {
    try {
      const { id } = req.user;
      const findUser = await dataSource.getRepository('Members').findOne({
        where: {
          id,
        },
        relations: ['level'],
      });

      res.status(200).json({
        status: 'success',
        data: {
          name: findUser.name,
          avatar: findUser.photo,
          email: findUser.email,
          preferredLocation: findUser.region,
          registerDate: new Date(`${findUser.created_at}`).toISOString().split('T')[0],
          level: findUser.level?.level || null,
          // totalPoint: findUser.totalPoint, // TODO: 這邊要從點數table查詢
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
      const { name, avatar, email, preferredLocation, level } = req.body;

      if ((name && !isValidString(name)) || (email && !isValidString(email))) {
        logger.warn('更新使用者資料錯誤:', '欄位未填寫正確');
        return next(appError(400, '欄位未填寫正確'));
      }

      // check email is valid
      if (email && !isValidEmail(email)) {
        logger.warn('更新使用者資料錯誤:', 'Email 格式不正確');
        return next(appError(400, 'Email 格式不正確'));
      }

      // 檢查用戶是否存在
      const existingMember = await dataSource.getRepository('Members').findOne({
        where: {
          id,
        },
        select: ['id', 'name', 'email', 'region', 'level'],
      });

      if (!existingMember) {
        logger.warn('更新使用者資料錯誤:', '使用者不存在');
        return next(appError(400, '更新使用者資料失敗'));
      }

      // 更新前檢查唯一欄位（如 email）是否與除了自己外的其他用戶衝突
      if (email && email !== existingMember.email) {
        const existingEmail = await dataSource.getRepository('Members').findOne({
          where: {
            email,
          },
        });

        if (existingEmail) {
          logger.warn('更新使用者資料錯誤:', '此 Email 已經註冊');
          return next(appError(409, '此 Email 已經註冊'));
        }
      }

      // 檢查等級是否存在
      let existingLevel = null;
      if (level) {
        existingLevel = await dataSource.getRepository('Levels').findOne({
          where: {
            level,
          },
          select: ['id'],
        });

        if (!existingLevel) {
          logger.warn('更新使用者資料錯誤:', '等級不存在');
          return next(appError(400, '等級不存在'));
        }
      }

      // 更新使用者資料
      const updatedMember = await dataSource.getRepository('Members').update(
        { id },
        {
          name,
          photo: avatar,
          email,
          region: preferredLocation,
          level_id: level ? existingLevel.id : existingLevel,
        },
      );

      // 檢查更新是否成功
      if (updatedMember.affected === 0) {
        logger.warn('更新使用者資料錯誤:', '更新失敗');
        return next(appError(400, '更新使用者資料失敗'));
      }

      logger.info('更新使用者資料成功:', updatedMember.id);

      // 重新查詢更新後的使用者資料
      const updateData = await dataSource.getRepository('Members').findOne({
        where: {
          id,
        },
        relations: ['level'],
      });

      res.status(200).json({
        message: '更新成功',
        data: {
          name: updateData.name,
          avatar: updateData.photo,
          email: updateData.email,
          preferredLocation: updateData.region,
          level: updateData.level?.level || null,
        },
      });
    } catch (error) {
      logger.error('更新使用者資料錯誤:', error);
      next(error);
    }
  },
  getMemberFavorites: async (req, res, next) => {
    try {
      const { id } = req.user;
      const activityLevelsRepo = dataSource.getRepository('ActivityLevels');
      const favorites = await dataSource.getRepository('MemberFavoriteActivities').find({
        where: {
          member_id: id,
        },
        relations: ['member', 'activity'],
      });

      if (!favorites) {
        res.status(200).json({
          status: 'success',
          data: [],
        });
      }

      const data = [];

      for (const favorite of favorites) {
        const start = new Date(favorite.activity.start_time);
        const end = new Date(favorite.activity.end_time);
        const date = start.toISOString().split('T')[0];
        const startTime = start.toISOString().split('T')[1].slice(0, 5);
        const endTime = end.toISOString().split('T')[1].slice(0, 5);

        const cityRepo = dataSource.getRepository('Cities');
        const cityData = await cityRepo.findOne({
          where: {
            zip_code: favorite.activity.zip_code,
          },
        });

        const levels = await activityLevelsRepo.find({
          where: { activity: { id: favorite.activity.id } },
          relations: ['level'],
        });
        const level = levels.map((al) => al.level.name);

        data.push({
          activityId: favorite.activity.id,
          name: favorite.activity.name,
          date,
          startTime,
          endTime,
          venueName: favorite.activity.venue_name,
          city: cityData.city,
          district: cityData.district,
          address: favorite.activity.address,
          level,
          participantCount: favorite.activity.participant_count,
          bookedCount: favorite.activity.booked_count,
          contactAvatar: favorite.member.photo,
          contactName: favorite.activity.contact_name,
          contactPhone: favorite.activity.contact_phone,
          contactLine: favorite.activity.contact_line,
          points: favorite.activity.points,
        });
      }

      res.status(200).json({
        message: '成功',
        data,
      });
    } catch (error) {
      logger.error('取得使用者收藏錯誤:', error);
      next(error);
    }
  },
};

module.exports = userController;
