const { dataSource } = require('../db/data-source');
const logger = require('../utils/logger')('Activities');
const { isValidUUID, isValidString, isNumber, isValidDate } = require('../utils/validUtils');
const appError = require('../utils/appError');
const dayjs = require('../utils/dayjs');

const activitiesController = {
  async getActivities(req, res, next) {
    try {
      const { search, zipCode, city, spotsLeft, level, date, timeSlot, points } = req.query;

      if (search && !isValidString(search)) {
        return next(appError(400, '搜尋關鍵字未填寫正確'));
      }
      if (zipCode && city) {
        return next(appError(400, '縣市區與縣市僅能擇一使用'));
      }
      if (zipCode && !isValidString(zipCode)) {
        return next(appError(400, '縣市區未填寫正確'));
      }
      if (city && !isValidString(city)) {
        return next(appError(400, '縣市未填寫正確'));
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
      const citiesRepo = dataSource.getRepository('Cities');

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
          return res.status(200).json({ message: '目前無資料', data: [] });
        }
      }

      const activitiesQuery = activitiesRepo
        .createQueryBuilder('activity')
        .leftJoinAndSelect('activity.member', 'member')
        .where('activity.status = :status', { status: 'published' });

      if (zipCode) {
        activitiesQuery.andWhere('activity.zip_code = :zipCode', { zipCode });
      } else if (city) {
        const cityZipCodes = await citiesRepo
          .createQueryBuilder('c')
          .where('c.city = :city', { city })
          .select('c.zip_code', 'zipCode')
          .getRawMany();

        const zipCodes = cityZipCodes.map((row) => row.zipCode);

        if (zipCodes.length === 0) {
          return res.status(400).json({ message: '縣市未填寫正確' });
        }

        activitiesQuery.andWhere('activity.zip_code IN (:...zipCodes)', { zipCodes });
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
        return res.status(200).json({ message: '目前無資料', data: [] });
      }

      const data = [];

      for (const activity of activities) {
        const start = dayjs(activity.start_time).tz();
        const end = dayjs(activity.end_time).tz();
        const date = start.format('YYYY-MM-DD');
        const startTime = start.format('HH:mm');
        const endTime = end.format('HH:mm');

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
      let isRegistered = false;
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

        const activitiesRegisterRepo = dataSource.getRepository('ActivitiesRegister');
        const registration = await activitiesRegisterRepo.findOne({
          where: {
            member_id: id,
            activity_id: activityId,
            status: 'registered',
          },
        });
        if (registration) {
          isRegistered = true;
        }
      }

      const activitiesRepo = dataSource.getRepository('Activities');
      const activities = await activitiesRepo.findOne({
        where: {
          id: activityId,
          status: 'published',
        },
        relations: ['member'],
      });
      if (!activities) {
        return next(appError(404, '查無活動資料'));
      }

      const now = dayjs().tz();
      const start = dayjs(activities.start_time).tz();
      const end = dayjs(activities.end_time).tz();
      const date = start.format('YYYY-MM-DD');
      const startTime = start.format('HH:mm');
      const endTime = end.format('HH:mm');

      let activityStatus;

      if (end.isBefore(now)) {
        activityStatus = 'ended';
      } else if (activities.booked_count >= activities.participant_count) {
        activityStatus = 'full';
      } else if (isRegistered) {
        activityStatus = 'registered';
      } else {
        activityStatus = 'published';
      }

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
          status: activityStatus,
        },
      });
    } catch (error) {
      logger.error('取得使用者資料錯誤:', error);
      next(error);
    }
  },
};

module.exports = activitiesController;
