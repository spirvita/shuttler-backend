const { dataSource } = require('../db/data-source');
const logger = require('../utils/logger')('Activities');
const { isValidUUID } = require('../utils/validUtils');
const appError = require('../utils/appError');

const activitiesController = {
  async getActivities(req, res, next) {
    try {
      const activitiesRepo = dataSource.getRepository('Activities');
      const activityLevelsRepo = dataSource.getRepository('ActivityLevels');

      const activities = await activitiesRepo.find({
        where: {
          status: 'published',
        },
        relations: ['member'],
      });

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

        data.push({
          activityId: activity.id,
          date,
          name: activity.name,
          contactAvatar: activity.member.photo,
          venueName: activity.venue_name,
          startTime,
          endTime,
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
  async getActivity(req, res, next) {
    try {
      const { activityId } = req.params;
      if (!isValidUUID(activityId)) {
        return next(appError(400, 'ID未填寫正確'));
      }
      const activitiesRepo = await dataSource.getRepository('Activities');
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
          organizer: activities.member.name,
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
        },
      });
    } catch (error) {
      logger.error('取得使用者資料錯誤:', error);
      next(error);
    }
  },
};

module.exports = activitiesController;
