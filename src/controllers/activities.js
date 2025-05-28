const { dataSource } = require('../db/data-source');
const logger = require('../utils/logger')('Activities');
const { isValidUUID, isValidString, isNumber, isValidDate } = require('../utils/validUtils');
const appError = require('../utils/appError');

const activitiesController = {
  async getActivities(req, res, next) {
    try {
      const { search, zipCode, spotsLeft, level, date, timeSlot, points } = req.query;

      if (search && !isValidString(search)) {
        return next(appError(400, '搜尋關鍵字未填寫正確'));
      }
      if (zipCode && !isValidString(zipCode)) {
        return next(appError(400, '縣市區未填寫正確'));
      }
      if (
        spotsLeft &&
        (!isNumber(Number(spotsLeft)) || Number(spotsLeft) < 1 || Number(spotsLeft) > 10)
      ) {
        return next(appError(400, '報名人數未填寫正確'));
      }
      if (level && (!isNumber(Number(level)) || Number(level) < 1 || Number(level) > 7)) {
        return next(appError(400, '等級未填寫正確'));
      }
      if (points && (!isNumber(Number(points)) || Number(points) < 0 || Number(points) > 1000)) {
        return next(appError(400, '點數未填寫正確'));
      }
      let dateTime = null;
      let endDateTime = null;
      if (timeSlot && !date) {
        return next(appError(400, '請提供日期以搭配時段'));
      }
      if (date) {
        if (!isValidDate(date)) {
          return next(appError(400, '日期格式錯誤，請使用 YYYY-MM-DD'));
        }

        if (timeSlot) {
          if (!isNumber(Number(timeSlot)) || Number(timeSlot) < 0 || Number(timeSlot) > 23) {
            return next(appError(400, '時段格式錯誤，請提供 0~23 的數字'));
          }
          dateTime = new Date(`${date}T${String(timeSlot).padStart(2, '0')}:00:00Z`);
        } else {
          dateTime = new Date(`${date}T00:00:00Z`);
        }

        if (isNaN(dateTime.getTime())) {
          return next(appError(400, '無效的日期時間'));
        }
      } else {
        dateTime = new Date();
      }
      endDateTime = new Date(dateTime);
      endDateTime.setDate(endDateTime.getDate() + 14);

      const activitiesRepo = dataSource.getRepository('Activities');
      const activityLevelsRepo = dataSource.getRepository('ActivityLevels');

      let activityIdsWithLevel = null;
      if (level) {
        const activityLevels = await activityLevelsRepo
          .createQueryBuilder('al')
          .leftJoin('al.level', 'level')
          .where('level.level >= :level', { level })
          .select('al.activity_id', 'activityId')
          .groupBy('al.activity_id')
          .getRawMany();

        activityIdsWithLevel = activityLevels.map((al) => al.activityId);
        if (activityIdsWithLevel.length === 0) {
          return res.status(200).json({ message: '成功', data: [] });
        }
      }

      const activitiesQuery = activitiesRepo
        .createQueryBuilder('activity')
        .leftJoinAndSelect('activity.member', 'member')
        .where('activity.status = :status', { status: 'published' });

      if (zipCode) {
        activitiesQuery.andWhere('activity.zip_code = :zipCode', { zipCode });
      }
      if (spotsLeft) {
        activitiesQuery.andWhere(
          '(activity.participant_count - activity.booked_count) >= :spotsLeft',
          { spotsLeft },
        );
      }
      if (points) {
        activitiesQuery.andWhere('activity.points >= :points', { points });
      }
      activitiesQuery.andWhere('activity.start_time >= :dateTime', { dateTime });
      activitiesQuery.andWhere('activity.start_time <= :endDateTime', { endDateTime });
      if (activityIdsWithLevel) {
        activitiesQuery.andWhere('activity.id IN (:...ids)', {
          ids: activityIdsWithLevel,
        });
      }
      if (search) {
        activitiesQuery.andWhere(
          '(activity.name LIKE :keyword OR activity.venue_name LIKE :keyword)',
          { keyword: `%${search}%` },
        );
      }

      activitiesQuery.orderBy('activity.start_time', 'ASC');
      const activities = await activitiesQuery.getMany();

      if (!activities || activities.length === 0) {
        return res.status(200).json({ message: '成功', data: [] });
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
        const levelNames = levels.map((al) => al.level.name);

        data.push({
          activityId: activity.id,
          date,
          name: activity.name,
          contactAvatar: activity.member.photo,
          venueName: activity.venue_name,
          startTime,
          endTime,
          level: levelNames,
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
  async getActivity(req, res, next) {
    try {
      const { activityId } = req.params;
      if (!isValidUUID(activityId)) {
        return next(appError(400, 'ID未填寫正確'));
      }

      const id = req.user ? req.user.id : null;
      let isFavorite = false;
      if (id) {
        const memberFavoriteActivitiesRepo = dataSource.getRepository('MemberFavoriteActivities');
        const favorite = await memberFavoriteActivitiesRepo.findOne({
          where: {
            member: { id },
            activity: { id: activityId },
          },
        });

        if (favorite) {
          isFavorite = true;
        }
      }

      const activitiesRepo = dataSource.getRepository('Activities');
      const activities = await activitiesRepo.findOne({
        where: {
          id: activityId,
        },
        relations: ['member'],
      });
      if (!activities) {
        return next(appError(404, '查無活動資料'));
      }
      const start = new Date(activities.start_time);
      const end = new Date(activities.end_time);
      const date = start.toISOString().split('T')[0];
      const startTime = start.toISOString().split('T')[1].slice(0, 5);
      const endTime = end.toISOString().split('T')[1].slice(0, 5);

      const cityRepo = dataSource.getRepository('Cities');
      const cityData = await cityRepo.findOne({
        where: {
          zip_code: activities.zip_code,
        },
      });

      const activityFacilitiesRepo = dataSource.getRepository('ActivityFacilities');
      const activityFacilities = await activityFacilitiesRepo.find({
        where: {
          activity: { id: activityId },
        },
        relations: ['facility'],
      });
      const venueFacilities = activityFacilities.map((af) => af.facility.name);

      const activityPicturesRepo = dataSource.getRepository('ActivityPictures');
      const pictures = await activityPicturesRepo.find({
        where: {
          activity: { id: activityId },
        },
      });
      const eventPictures = pictures.map((p) => p.url);

      const activityLevelsRepo = dataSource.getRepository('ActivityLevels');
      const levels = await activityLevelsRepo.find({
        where: { activity: { id: activityId } },
        relations: ['level'],
      });
      const level = levels.map((al) => al.level.name);

      res.status(200).json({
        message: '成功',
        data: {
          activityId: activities.id,
          name: activities.name,
          organizer: activities.organizer,
          pictures: eventPictures,
          date,
          startTime,
          endTime,
          venueName: activities.venue_name,
          city: cityData.city,
          district: cityData.district,
          address: activities.address,
          venueFacilities,
          ballType: activities.ball_type,
          level,
          participantCount: activities.participant_count,
          bookedCount: activities.booked_count,
          rentalLot: activities.rental_lot,
          brief: activities.brief,
          contactAvatar: activities.member.photo,
          contactName: activities.contact_name,
          contactPhone: activities.contact_phone,
          contactLine: activities.contact_line,
          points: activities.points,
          isFavorite,
        },
      });
    } catch (error) {
      logger.error('取得使用者資料錯誤:', error);
      next(error);
    }
  },
};

module.exports = activitiesController;
