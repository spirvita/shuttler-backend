const { dataSource } = require('../db/data-source');
const logger = require('../utils/logger')('Activity');
const appError = require('../utils/appError');
const { isValidUUID } = require('../utils/validUtils');
const { In, Not } = require('typeorm');

const activitiesController = {
  async upcomingActivities(req, res, next) {
    try {
      const id = req.user ? req.user.id : null;
      const membersRepo = dataSource.getRepository('Members');
      let member = null;
      if (id) {
        member = await membersRepo.findOne({
          where: { id },
        });
      }

      const activitiesRepo = dataSource.getRepository('Activities');
      const activityLevelsRepo = dataSource.getRepository('ActivityLevels');
      const activityPicturesRepo = dataSource.getRepository('ActivityPictures');
      const cityRepo = dataSource.getRepository('Cities');

      const takeLimit = 6;

      // Step 1: 先查詢會員地區的活動
      const primaryActivities = await activitiesRepo.find({
        where: {
          is_published: true,
          ...(member?.region?.length > 0 ? { zip_code: In(member.region) } : {}),
        },
        order: {
          start_time: 'ASC',
        },
        take: takeLimit,
      });

      const remaining = takeLimit - primaryActivities.length;
      let fallbackActivities = [];

      if (remaining > 0) {
        // Step 2: 補齊活動（排除已出現的活動 ID）
        const excludedIds = primaryActivities.map((a) => a.id);

        fallbackActivities = await activitiesRepo.find({
          where: {
            is_published: true,
            id: Not(In(excludedIds)),
          },
          order: {
            start_time: 'ASC',
          },
          take: remaining,
        });
      }

      // 合併活動
      const activities = [...primaryActivities, ...fallbackActivities];

      if (!activities || activities.length === 0) {
        return next(appError(404, '查無活動資料'));
      }

      const data = [];

      for (const activity of activities) {
        const start = new Date(activity.start_time);
        const end = new Date(activity.end_time);
        const date = start.toISOString().split('T')[0];
        const startTime = start.toISOString().split('T')[1].slice(0, 5);
        const endTime = end.toISOString().split('T')[1].slice(0, 5);

        const levels = await activityLevelsRepo.find({
          where: { activity: { id: activity.id } },
          relations: ['level'],
        });
        const level = levels.map((al) => al.level.name);

        const picture = await activityPicturesRepo.findOne({
          where: {
            activity_id: activity.id,
            sort_order: 1,
          },
        });
        // 如果沒有圖片，則使用預設圖片(尚需設定預設圖片)
        const eventPicture = picture
          ? picture.url
          : 'https://images.unsplash.com/photo-1617696618050-b0fef0c666af?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

        const cityData = await cityRepo.findOne({
          where: {
            zip_code: activity.zip_code,
          },
        });

        data.push({
          activityId: activity.id,
          name: activity.name,
          picture: eventPicture,
          date,
          startTime,
          endTime,
          city: cityData.city,
          level,
          participantCount: activity.participant_count,
          bookedCount: activity.booked_count,
          points: activity.points,
        });
      }

      res.status(200).json({
        message: '成功',
        data,
      });
    } catch (error) {
      logger.error('取得活動資料錯誤:', error);
      next(error);
    }
  },
  async popularActivities(req, res, next) {
    try {
      const id = req.user ? req.user.id : null;
      const membersRepo = dataSource.getRepository('Members');
      let member = null;
      if (id) {
        member = await membersRepo.findOne({
          where: { id },
        });
      }

      const activitiesRepo = dataSource.getRepository('Activities');
      const activityLevelsRepo = dataSource.getRepository('ActivityLevels');
      const activityPicturesRepo = dataSource.getRepository('ActivityPictures');
      const cityRepo = dataSource.getRepository('Cities');
      const takeLimit = 6;

      // 會員地區的熱門活動（排除滿人，參與比例高>低排序）
      const primaryQuery = activitiesRepo
        .createQueryBuilder('a')
        .select([
          'a.id',
          'a.name',
          'a.zip_code',
          'a.booked_count',
          'a.participant_count',
          'a.points',
          '(a.booked_count::float / NULLIF(a.participant_count, 0)) AS participation_ratio',
        ])
        .where('a.is_published = true')
        .andWhere('a.booked_count < a.participant_count')
        .orderBy('participation_ratio', 'DESC')
        .addOrderBy('a.start_time', 'ASC')
        .take(takeLimit);

      if (member?.region?.length > 0) {
        primaryQuery.andWhere('a.zip_code IN (:...region)', { region: member.region });
      }

      const primaryRawActivities = await primaryQuery.getRawMany();

      // 補齊不足筆數（排除已抓到的活動）
      const remaining = takeLimit - primaryRawActivities.length;
      let fallbackRawActivities = [];

      if (remaining > 0) {
        const excludedIds = primaryRawActivities.map((a) => a.a_id);

        const fallbackQuery = activitiesRepo
          .createQueryBuilder('a')
          .select([
            'a.id',
            'a.name',
            'a.zip_code',
            'a.booked_count',
            'a.participant_count',
            'a.points',
            '(a.booked_count::float / NULLIF(a.participant_count, 0)) AS participation_ratio',
          ])
          .where('a.is_published = true')
          .andWhere('a.booked_count < a.participant_count')
          .andWhere('a.id NOT IN (:...excludedIds)', { excludedIds })
          .orderBy('participation_ratio', 'DESC')
          .addOrderBy('a.start_time', 'ASC')
          .take(remaining);

        fallbackRawActivities = await fallbackQuery.getRawMany();
      }

      // 合併活動
      const activities = [...primaryRawActivities, ...fallbackRawActivities];

      if (!activities || activities.length === 0) {
        return next(appError(404, '查無活動資料'));
      }

      const data = [];

      for (const activity of activities) {
        const levels = await activityLevelsRepo.find({
          where: { activity: { id: activity.a_id } },
          relations: ['level'],
        });
        const level = levels.map((al) => al.level.name);

        const picture = await activityPicturesRepo.findOne({
          where: {
            activity_id: activity.id,
            sort_order: 1,
          },
        });
        // 如果沒有圖片，則使用預設圖片(尚需設定預設圖片)
        const eventPicture = picture
          ? picture.url
          : 'https://images.unsplash.com/photo-1617696618050-b0fef0c666af?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

        const cityData = await cityRepo.findOne({
          where: {
            zip_code: activity.a_zip_code,
          },
        });

        data.push({
          activityId: activity.a_id,
          name: activity.a_name,
          picture: eventPicture,
          city: cityData.city,
          level,
          participantCount: activity.a_participant_count,
          bookedCount: activity.a_booked_count,
          points: activity.a_points,
        });
      }

      res.status(200).json({
        message: '成功',
        data,
      });
    } catch (error) {
      logger.error('取得活動資料錯誤:', error);
      next(error);
    }
  },
  async addFavoriteActivities(req, res, next) {
    try {
      const { activityId } = req.body;
      const { id } = req.user;
      if (!isValidUUID(activityId) || !isValidUUID(id)) {
        return next(appError(400, 'ID未填寫正確'));
      }
      const membersRepo = dataSource.getRepository('Members');
      const activitiesRepo = dataSource.getRepository('Activities');
      const memberFavoriteActivitiesRepo = dataSource.getRepository('MemberFavoriteActivities');
      const member = await membersRepo.findOne({
        where: { id },
      });
      if (!member) {
        return next(appError(404, '會員不存在'));
      }
      const activity = await activitiesRepo.findOne({
        where: { id: activityId },
      });
      if (!activity) {
        return next(appError(404, '活動不存在'));
      }

      const memberFavoriteActivities = await memberFavoriteActivitiesRepo.findOne({
        where: {
          member: { id: member.id },
          activity: { id: activityId },
        },
      });
      if (memberFavoriteActivities) {
        return next(appError(409, '已收藏過此活動'));
      }

      const newFavoriteActivity = memberFavoriteActivitiesRepo.create({
        member: { id: member.id },
        activity: { id: activityId },
      });
      await memberFavoriteActivitiesRepo.save(newFavoriteActivity);

      res.status(201).json({
        message: '收藏成功',
      });
    } catch (error) {
      logger.error('取得活動資料錯誤:', error);
      next(error);
    }
  },
  async deleteFavoriteActivities(req, res, next) {
    try {
      const { activityId } = req.params;
      const { id } = req.user;
      if (!isValidUUID(activityId) || !isValidUUID(id)) {
        return next(appError(400, 'ID未填寫正確'));
      }
      const membersRepo = dataSource.getRepository('Members');
      const activitiesRepo = dataSource.getRepository('Activities');
      const memberFavoriteActivitiesRepo = dataSource.getRepository('MemberFavoriteActivities');
      const member = await membersRepo.findOne({
        where: { id },
      });
      if (!member) {
        return next(appError(404, '會員不存在'));
      }
      const activity = await activitiesRepo.findOne({
        where: { id: activityId },
      });
      if (!activity) {
        return next(appError(404, '活動不存在'));
      }

      const memberFavoriteActivities = await memberFavoriteActivitiesRepo.findOne({
        where: {
          member: { id: member.id },
          activity: { id: activityId },
        },
      });
      if (!memberFavoriteActivities) {
        return next(appError(409, '尚未收藏過此活動'));
      }

      await memberFavoriteActivitiesRepo.delete(memberFavoriteActivities.id);

      res.status(200).json({
        message: '取消收藏成功',
      });
    } catch (error) {
      logger.error('取得活動資料錯誤:', error);
      next(error);
    }
  },
};

module.exports = activitiesController;
