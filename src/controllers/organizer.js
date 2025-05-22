const { dataSource } = require('../db/data-source');
const logger = require('../utils/logger')('Organizer');
const appError = require('../utils/appError');
const { isValidUUID } = require('../utils/validUtils');
const { In } = require('typeorm');

const organizerController = {
  async updateActivity(req, res, next) {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const memberId = req.user.id;
      const { activityId } = req.params;
      if (!isValidUUID(activityId)) {
        return next(appError(400, 'ID未填寫正確'));
      }
      const {
        pictures,
        participantCount,
        rentalLot,
        ballType,
        level,
        brief,
        venueName,
        venueFacilities,
        contactName,
        contactPhone,
        contactLine,
      } = req.body;
      if (
        !participantCount ||
        !rentalLot ||
        !ballType ||
        !level ||
        !brief ||
        !venueName ||
        !venueFacilities ||
        !contactName ||
        !contactPhone ||
        !contactLine
      ) {
        return next(appError(400, '欄位未填寫正確'));
      }

      const activity = await queryRunner.manager.getRepository('Activities').findOne({
        where: { id: activityId, member_id: memberId },
      });
      if (!activity) {
        return next(appError(404, '活動不存在或無權限編輯'));
      }
      if (participantCount < activity.booked_count) {
        return next(appError(400, `活動名額不能小於已報名人數 (${activity.booked_count})`));
      }

      const activityUpdate = await queryRunner.manager.getRepository('Activities').update(
        { id: activityId },
        {
          participant_count: participantCount,
          rental_lot: rentalLot,
          ball_type: ballType,
          brief,
          venue_name: venueName,
          contact_name: contactName,
          contact_phone: contactPhone,
          contact_line: contactLine,
        },
      );
      if (activityUpdate.affected === 0) {
        return next(appError(400, '更新失敗'));
      }

      const levels = await queryRunner.manager.getRepository('Levels').find({
        where: { level: In(level) },
      });
      if (levels.length !== level.length) {
        return next(appError(404, '無此等級'));
      }
      const activityLevels = levels.map((l) => ({
        activity_id: activityId,
        level_id: l.id,
      }));
      await queryRunner.manager.getRepository('ActivityLevels').delete({ activity_id: activityId });
      await queryRunner.manager.getRepository('ActivityLevels').save(activityLevels);

      const facilities = await queryRunner.manager.getRepository('Facilities').find({
        where: { name: In(venueFacilities) },
      });
      if (facilities.length !== venueFacilities.length) {
        return next(appError(404, '無此設施'));
      }
      const activityFacilities = facilities.map((f) => ({
        activity_id: activityId,
        facility_id: f.id,
      }));
      await queryRunner.manager
        .getRepository('ActivityFacilities')
        .delete({ activity_id: activityId });
      await queryRunner.manager.getRepository('ActivityFacilities').save(activityFacilities);

      const activityPictures = pictures.map((p, index) => ({
        activity_id: activityId,
        url: p,
        sort_order: index + 1,
      }));
      await queryRunner.manager
        .getRepository('ActivityPictures')
        .delete({ activity_id: activityId });
      await queryRunner.manager.getRepository('ActivityPictures').save(activityPictures);

      await queryRunner.commitTransaction();

      res.status(200).json({
        message: '編輯成功',
        activityId,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('更新活動資料錯誤:', error);
      next(error);
    } finally {
      await queryRunner.release();
    }
  },
};

module.exports = organizerController;
