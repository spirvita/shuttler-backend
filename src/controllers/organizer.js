const { dataSource } = require('../db/data-source');
const logger = require('../utils/logger')('Organizer');
const appError = require('../utils/appError');
const {
  isValidUUID,
  isNumber,
  isValidString,
  isValidDate,
  isValidTime,
} = require('../utils/validUtils');
const { In } = require('typeorm');
const dayjs = require('../utils/dayjs');

const organizerController = {
  async getActivities(req, res, next) {
    try {
      const memberId = req.user.id;
      const activityFacilitiesRepo = dataSource.getRepository('ActivityFacilities');
      const activityPicturesRepo = dataSource.getRepository('ActivityPictures');
      const activityLevelsRepo = dataSource.getRepository('ActivityLevels');
      const activitiesRepo = dataSource.getRepository('Activities');
      const cityRepo = dataSource.getRepository('Cities');
      const activities = await activitiesRepo.find({
        where: { member_id: memberId },
        relations: ['member'],
      });

      if (!activities || activities.length === 0) {
        return res.status(200).json({ message: '目前無資料', data: [] });
      }

      const now = dayjs().tz();
      const data = [];

      for (const activity of activities) {
        const start = dayjs(activity.start_time).tz();
        const end = dayjs(activity.end_time).tz();
        const date = start.format('YYYY-MM-DD');
        const startTime = start.format('HH:mm');
        const endTime = end.format('HH:mm');

        const cityData = await cityRepo.findOne({
          where: { zip_code: activity.zip_code },
        });

        const activityFacilities = await activityFacilitiesRepo.find({
          where: { activity: { id: activity.id } },
          relations: ['facility'],
        });
        const venueFacilities = activityFacilities.map((af) => af.facility.name);

        const pictures = await activityPicturesRepo.find({
          where: { activity: { id: activity.id } },
        });
        const eventPictures = pictures.map((p) => p.url);

        const levels = await activityLevelsRepo.find({
          where: { activity: { id: activity.id } },
          relations: ['level'],
        });
        const level = levels.map((al) => al.level.name);

        let activityStatus;
        if (activity.status === 'draft') {
          activityStatus = 'draft';
        } else if (activity.status === 'suspended') {
          activityStatus = 'suspended';
        } else if (activity.status === 'published') {
          activityStatus = end.isBefore(now) ? 'ended' : 'published';
        }

        data.push({
          activityId: activity.id,
          name: activity.name,
          organizer: activity.organizer,
          pictures: eventPictures,
          date,
          startTime,
          endTime,
          venueName: activity.venue_name,
          city: cityData.city,
          district: cityData.district,
          address: activity.address,
          venueFacilities,
          ballType: activity.ball_type,
          level,
          participantCount: activity.participant_count,
          bookedCount: activity.booked_count,
          rentalLot: activity.rental_lot,
          brief: activity.brief,
          contactAvatar: activity.member.photo,
          contactName: activity.contact_name,
          contactPhone: activity.contact_phone,
          contactLine: activity.contact_line,
          points: activity.points,
          status: activityStatus,
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
      const { memberId } = req.user;
      const { activityId } = req.params;
      if (!isValidUUID(activityId)) {
        return next(appError(400, 'ID未填寫正確'));
      }

      const pointsRecordRepo = dataSource.getRepository('PointsRecord');
      const activitiesRepo = dataSource.getRepository('Activities');
      const activitiesRegisterRepo = dataSource.getRepository('ActivitiesRegister');
      const activity = await activitiesRepo.findOne({
        where: {
          id: activityId,
          member_id: memberId,
        },
      });
      if (!activity) {
        return next(appError(404, '無此活動或無權限查看'));
      }
      const activitiesRegister = await activitiesRegisterRepo.find({
        where: { activity: { id: activityId } },
        relations: ['member', 'activity'],
      });
      if (!activitiesRegister || activitiesRegister.length === 0) {
        return next(appError(404, '查無活動報名資料'));
      }

      const statusMap = {
        cancelled: '已取消',
        registered: '已報名',
        suspended: '已停辦',
      };

      const data = await Promise.all(
        activitiesRegister.map(async (ar) => {
          const member = ar.member;
          const activity = ar.activity;

          let refundPoints = null;

          if (ar.status === 'cancelled' || ar.status === 'suspended') {
            const recordType = ar.status === 'cancelled' ? 'cancelAct' : 'suspendAct';
            const pointsRecord = await pointsRecordRepo.findOne({
              where: {
                activity_id: activityId,
                member_id: member.id,
                recordType,
              },
            });
            refundPoints = pointsRecord ? pointsRecord.points_change : 0;
          }

          return {
            memberId: member.id,
            name: member.name,
            email: member.email,
            registrationDate: dayjs.tz(ar.created_at).format('YYYY-MM-DD HH:mm'),
            cancellationDate:
              ar.status === 'cancelled' || ar.status === 'suspended'
                ? dayjs.tz(ar.updated_at).format('YYYY-MM-DD HH:mm')
                : null,
            registrationCount: ar.participant_count,
            registrationPoints: ar.participant_count * activity.points,
            refundPoints,
            status: statusMap[ar.status] || ar.status,
          };
        }),
      );

      res.status(200).json({
        message: '取得活動資料成功',
        data,
      });
    } catch (error) {
      logger.error('取得活動資料錯誤:', error);
      next(error);
    }
  },
  async updateActivity(req, res, next) {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const memberId = req.user.id;
      const { activityId } = req.params;
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
      if (!isValidUUID(activityId)) {
        return next(appError(400, 'ID未填寫正確'));
      }
      if (!Array.isArray(pictures)) {
        return next(appError(400, '圖片未填寫正確'));
      }
      if (pictures.length > 5) {
        return next(appError(400, '圖片數量不能超過5張'));
      }
      if (!isNumber(participantCount)) {
        return next(appError(400, '人數未填寫正確'));
      }
      if (!isNumber(rentalLot) || rentalLot <= 0) {
        return next(appError(400, '租用場地數量未填寫正確'));
      }
      if (!isValidString(ballType)) {
        return next(appError(400, '球類未填寫正確'));
      }
      if (!Array.isArray(level) || level.length < 1 || level.length > 2 || !level.every(isNumber)) {
        return next(appError(400, '程度未填寫正確'));
      }
      if (brief && !isValidString(brief)) {
        return next(appError(400, '簡介未填寫正確'));
      }
      if (!isValidString(venueName)) {
        return next(appError(400, '場地名稱未填寫正確'));
      }
      if (!Array.isArray(venueFacilities) || venueFacilities.length === 0) {
        return next(appError(400, '場地設施未填寫正確'));
      }
      if (!isValidString(contactName)) {
        return next(appError(400, '聯絡人姓名未填寫正確'));
      }
      if (!isValidString(contactPhone)) {
        return next(appError(400, '聯絡人電話未填寫正確'));
      }
      if (contactLine && !isValidString(contactLine)) {
        return next(appError(400, '聯絡人Line未填寫正確'));
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
  async suspendActivity(req, res, next) {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const memberId = req.user.id;
      const { activityId } = req.params;
      if (!isValidUUID(activityId)) {
        return next(appError(400, 'ID未填寫正確'));
      }

      const memberRepo = queryRunner.manager.getRepository('Members');
      const activitiesRepo = queryRunner.manager.getRepository('Activities');
      const activitiesRegisterRepo = queryRunner.manager.getRepository('ActivitiesRegister');
      const pointsRecordRepo = queryRunner.manager.getRepository('PointsRecord');

      const activity = await activitiesRepo.findOne({
        where: { id: activityId, member_id: memberId, status: 'published' },
      });
      if (!activity) {
        return next(appError(404, '無此活動或無權限查看'));
      }

      const now = dayjs().tz();
      const start = dayjs(activity.start_time).tz();
      const end = dayjs(activity.end_time).tz();
      if (end.isBefore(now)) {
        return next(appError(400, '活動已經結束，無法停辦'));
      }
      if (start.isBefore(now)) {
        return next(appError(400, '活動已經開始，無法停辦'));
      }

      await activitiesRepo.update({ id: activityId }, { status: 'suspended' });
      const activitiesRegisters = await activitiesRegisterRepo.find({
        where: { activity: { id: activityId } },
        relations: ['member'],
      });

      let totalRefundCount = 0;

      for (const register of activitiesRegisters) {
        if (register.status === 'registered') {
          register.status = 'suspended';
          await activitiesRegisterRepo.save(register);

          const refundPoints = register.participant_count * activity.points;
          totalRefundCount += register.participant_count;
          await pointsRecordRepo.save({
            activity_id: activityId,
            member_id: register.member.id,
            points_change: refundPoints,
            recordType: 'suspendAct',
          });
          register.member.points += refundPoints;
          await memberRepo.save(register.member);
        }
      }

      await activitiesRepo.update(
        { id: activityId },
        { booked_count: activity.booked_count - totalRefundCount },
      );

      await queryRunner.commitTransaction();

      res.status(200).json({
        message: '停辦成功',
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('停辦活動錯誤:', error);
      next(error);
    } finally {
      await queryRunner.release();
    }
  },
  async updateDraftActivity(req, res, next) {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { id } = req.user;
      const { activityId } = req.params;
      if (!isValidUUID(id)) {
        return next(appError(400, 'ID未填寫正確'));
      }
      const {
        name,
        pictures,
        date,
        startTime,
        endTime,
        participantCount,
        rentalLot,
        ballType,
        points,
        level,
        brief,
        city,
        district,
        venueName,
        address,
        venueFacilities,
        organizer,
        contactName,
        contactPhone,
        contactLine,
        status,
      } = req.body;
      if (!isValidString(name)) {
        return next(appError(400, '活動名稱未填寫正確'));
      }
      if (pictures && !Array.isArray(pictures)) {
        return next(appError(400, '圖片未填寫正確'));
      }
      if (pictures && pictures.length > 5) {
        return next(appError(400, '圖片數量不能超過5張'));
      }
      if (!isValidDate(date)) {
        return next(appError(400, '活動日期未填寫正確'));
      }
      if (!isValidTime(startTime)) {
        return next(appError(400, '活動開始時間未填寫正確'));
      }
      if (!isValidTime(endTime)) {
        return next(appError(400, '活動結束時間未填寫正確'));
      }
      if (!isNumber(participantCount) || participantCount <= 0) {
        return next(appError(400, '人數未填寫正確'));
      }
      if (!isNumber(rentalLot) || rentalLot <= 0) {
        return next(appError(400, '租用場地數量未填寫正確'));
      }
      if (!isValidString(ballType)) {
        return next(appError(400, '球類未填寫正確'));
      }
      if (!isNumber(points) || points < 0) {
        return next(appError(400, '點數未填寫正確'));
      }
      if (!Array.isArray(level) || level.length < 1 || level.length > 2 || !level.every(isNumber)) {
        return next(appError(400, '程度未填寫正確'));
      }
      if (brief && !isValidString(brief)) {
        return next(appError(400, '簡介未填寫正確'));
      }
      if (!isValidString(city)) {
        return next(appError(400, '縣市未填寫正確'));
      }
      if (!isValidString(district)) {
        return next(appError(400, '區域未填寫正確'));
      }
      if (!isValidString(venueName)) {
        return next(appError(400, '場地名稱未填寫正確'));
      }
      if (!isValidString(address)) {
        return next(appError(400, '地址未填寫正確'));
      }
      if (
        !Array.isArray(venueFacilities) ||
        venueFacilities.length === 0 ||
        !venueFacilities.every(isValidString)
      ) {
        return next(appError(400, '場地設施未填寫正確'));
      }
      if (!isValidString(organizer)) {
        return next(appError(400, '主辦單位未填寫正確'));
      }
      if (!isValidString(contactName)) {
        return next(appError(400, '聯絡人姓名未填寫正確'));
      }
      if (!isValidString(contactPhone)) {
        return next(appError(400, '聯絡人電話未填寫正確'));
      }
      if (contactLine && !isValidString(contactLine)) {
        return next(appError(400, '聯絡人Line未填寫正確'));
      }
      if (!['draft', 'published'].includes(status)) {
        return next(appError(400, '狀態未填寫正確'));
      }
      const startDateTime = dayjs(`${date} ${startTime}`, 'YYYY-MM-DD HH:mm').tz();
      const endDateTime = dayjs(`${date} ${endTime}`, 'YYYY-MM-DD HH:mm').tz();
      const now = dayjs().tz();
      if (status === 'published' && startDateTime.isBefore(now)) {
        return next(appError(400, '發佈活動時，開始時間必須在現在時間之後'));
      }
      if (status === 'published' && endDateTime.isSameOrBefore(startDateTime)) {
        return next(appError(400, '發佈活動時，結束時間必須在開始時間之後'));
      }
      if (status === 'draft' && endDateTime.isSameOrBefore(startDateTime)) {
        return next(appError(400, '儲存活動時，結束時間必須在開始時間之後'));
      }
      const cityData = await queryRunner.manager.getRepository('Cities').findOne({
        where: { city, district },
      });
      if (!cityData) {
        return next(appError(404, '找不到該縣市區'));
      }

      const activitiesRepo = queryRunner.manager.getRepository('Activities');
      const existingActivity = await activitiesRepo.findOne({
        where: { id: activityId, member_id: id, status: 'draft' },
      });
      if (!existingActivity) {
        return next(appError(404, '無此活動或無權限編輯'));
      }

      const activityUpdate = await queryRunner.manager.getRepository('Activities').update(
        { id: activityId },
        {
          name,
          start_time: startDateTime.toDate(),
          end_time: endDateTime.toDate(),
          participant_count: participantCount,
          rental_lot: rentalLot,
          ball_type: ballType,
          points,
          brief,
          zip_code: cityData.zip_code,
          address,
          venue_name: venueName,
          organizer,
          contact_name: contactName,
          contact_phone: contactPhone,
          contact_line: contactLine,
          status,
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

      res.status(201).json({
        message: status === 'published' ? '發佈成功' : '儲存成功',
        activityId,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('新建活動錯誤:', error);
      next(error);
    } finally {
      await queryRunner.release();
    }
  },
  async deleteDraftActivity(req, res, next) {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const memberId = req.user.id;
      const { activityId } = req.params;
      if (!isValidUUID(activityId)) {
        return next(appError(400, 'ID未填寫正確'));
      }

      const activitiesRepo = queryRunner.manager.getRepository('Activities');
      const activityPicturesRepo = queryRunner.manager.getRepository('ActivityPictures');
      const activityFacilitiesRepo = queryRunner.manager.getRepository('ActivityFacilities');
      const activityLevelsRepo = queryRunner.manager.getRepository('ActivityLevels');
      const activity = await activitiesRepo.findOne({
        where: { id: activityId, member_id: memberId, status: 'draft' },
      });
      if (!activity) {
        return next(appError(404, '無此活動或無權限刪除'));
      }

      await activityPicturesRepo.delete({ activity_id: activityId });
      await activityFacilitiesRepo.delete({ activity_id: activityId });
      await activityLevelsRepo.delete({ activity_id: activityId });
      await activitiesRepo.delete({ id: activityId });

      await queryRunner.commitTransaction();

      res.status(200).json({
        message: '刪除成功',
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('刪除活動錯誤:', error);
      next(error);
    } finally {
      await queryRunner.release();
    }
  }
};

module.exports = organizerController;
