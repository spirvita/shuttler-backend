const { dataSource } = require('../db/data-source');
const logger = require('../utils/logger')('Activity');
const appError = require('../utils/appError');
const dayjs = require('../utils/dayjs');
const {
  isValidUUID,
  isNumber,
  isValidString,
  isValidDate,
  isValidTime,
} = require('../utils/validUtils');
const { In, Not, MoreThan } = require('typeorm');

const activityController = {
  async createActivity(req, res, next) {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { id } = req.user;
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
      if (status === 'draft' && startDateTime.isBefore(now)) {
        return next(appError(400, '儲存活動時，開始時間必須在現在時間之後'));
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
      const newActivity = activitiesRepo.create({
        member_id: id,
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
      });
      await activitiesRepo.save(newActivity);

      const levels = await queryRunner.manager.getRepository('Levels').find({
        where: { level: In(level) },
      });
      if (levels.length !== level.length) {
        return next(appError(404, '無此等級'));
      }
      const activityLevels = levels.map((l) => ({
        activity_id: newActivity.id,
        level_id: l.id,
      }));
      await queryRunner.manager.getRepository('ActivityLevels').save(activityLevels);

      const facilities = await queryRunner.manager.getRepository('Facilities').find({
        where: { name: In(venueFacilities) },
      });
      if (facilities.length !== venueFacilities.length) {
        return next(appError(404, '無此設施'));
      }
      const activityFacilities = facilities.map((f) => ({
        activity_id: newActivity.id,
        facility_id: f.id,
      }));
      await queryRunner.manager.getRepository('ActivityFacilities').save(activityFacilities);

      const activityPictures = pictures.map((p, index) => ({
        activity_id: newActivity.id,
        url: p,
        sort_order: index + 1,
      }));
      await queryRunner.manager.getRepository('ActivityPictures').save(activityPictures);

      await queryRunner.commitTransaction();

      res.status(201).json({
        message: status === 'published' ? '發佈成功' : '儲存成功',
        activityId: newActivity.id,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('新建活動錯誤:', error);
      next(error);
    } finally {
      await queryRunner.release();
    }
  },
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
      const now = dayjs().tz().toDate();

      // Step 1: 先查詢會員地區的活動
      const primaryActivities = await activitiesRepo.find({
        where: {
          status: 'published',
          start_time: MoreThan(now),
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
            status: 'published',
            start_time: MoreThan(now),
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
      const now = dayjs().tz().toDate();

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
        .where('a.status = :status', { status: 'published' })
        .andWhere('a.booked_count < a.participant_count')
        .andWhere('a.start_time > :now', { now })
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
          .where('a.status = :status', { status: 'published' })
          .andWhere('a.booked_count < a.participant_count')
          .andWhere('a.start_time > :now', { now });
        if (excludedIds.length > 0) {
          fallbackQuery.andWhere('a.id NOT IN (:...excludedIds)', { excludedIds });
        }
        fallbackQuery
          .orderBy('participation_ratio', 'DESC')
          .addOrderBy('a.start_time', 'ASC')
          .take(remaining);

        fallbackRawActivities = await fallbackQuery.getRawMany();
      }

      // 合併活動
      const activities = [...primaryRawActivities, ...fallbackRawActivities];

      if (!activities || activities.length === 0) {
        return res.status(200).json({ message: '目前無資料', data: [] });
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
  async registerActivity(req, res, next) {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { id } = req.user;
      const { activityId, participantCount } = req.body;

      if (!isValidUUID(activityId)) {
        return next(appError(400, '活動ID未填寫正確'));
      }
      if (!isNumber(participantCount) || participantCount <= 0) {
        return next(appError(400, '報名人數未填寫正確'));
      }

      const membersRepo = queryRunner.manager.getRepository('Members');
      const activitiesRepo = queryRunner.manager.getRepository('Activities');
      const activitiesRegisterRepo = queryRunner.manager.getRepository('ActivitiesRegister');
      const pointsRecordRepo = queryRunner.manager.getRepository('PointsRecord');

      const member = await membersRepo.findOne({
        where: { id },
      });
      if (!member) {
        return next(appError(404, '會員不存在'));
      }

      const activity = await activitiesRepo.findOne({
        where: {
          id: activityId,
          status: 'published',
        },
      });
      if (!activity) {
        return next(appError(404, '活動不存在'));
      }

      const now = dayjs().tz();
      const activityStartTime = dayjs(activity.start_time).tz();
      if (!activityStartTime.isAfter(now)) {
        return next(appError(400, '活動已結束'));
      }

      if (activity.booked_count + participantCount > activity.participant_count) {
        return next(
          appError(
            400,
            `活動名額不足，剩餘 ${activity.participant_count - activity.booked_count} 人`,
          ),
        );
      }

      const totalCost = activity.points * participantCount;
      if (member.points < totalCost) {
        return next(appError(400, '報名失敗，活動點數不足'));
      }

      let registration = await activitiesRegisterRepo.findOne({
        where: {
          member: { id: member.id },
          activity: { id: activityId },
        },
      });
      if (registration && registration.status === 'registered') {
        return next(appError(409, '你已經報名此活動'));
      }

      if (registration) {
        registration.status = 'registered';
        registration.participant_count = participantCount;
      } else {
        registration = activitiesRegisterRepo.create({
          member: { id: member.id },
          activity: { id: activityId },
          status: 'registered',
          participant_count: participantCount,
        });
      }

      await activitiesRegisterRepo.save(registration);

      member.points -= totalCost;
      await membersRepo.save(member);

      activity.booked_count += participantCount;
      await activitiesRepo.save(activity);

      await pointsRecordRepo.save({
        member: { id: member.id },
        activity: { id: activity.id },
        points_change: -totalCost,
        recordType: 'applyAct',
      });

      const host = await membersRepo.findOne({
        where: { id: activity.member_id },
      });

      host.points += totalCost;
      await membersRepo.save(host);

      await pointsRecordRepo.save({
        member: { id: host.id },
        activity: { id: activity.id },
        points_change: totalCost,
        recordType: 'receiveAct',
      });

      await queryRunner.commitTransaction();

      res.status(201).json({
        message: '報名成功',
        registrationId: registration.id,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('報名活動錯誤:', error);
      next(error);
    } finally {
      await queryRunner.release();
    }
  },
  async cancelActivity(req, res, next) {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { id } = req.user;
      const { activityId } = req.params;

      if (!isValidUUID(activityId)) {
        return next(appError(400, '活動ID未填寫正確'));
      }

      const membersRepo = queryRunner.manager.getRepository('Members');
      const activitiesRepo = queryRunner.manager.getRepository('Activities');
      const activitiesRegisterRepo = queryRunner.manager.getRepository('ActivitiesRegister');
      const pointsRecordRepo = queryRunner.manager.getRepository('PointsRecord');

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

      const now = dayjs().tz();
      const activityStartTime = dayjs(activity.start_time).tz();
      if (activityStartTime.isBefore(now)) {
        return next(appError(400, '活動已開始，無法取消報名'));
      }
      const twoHoursBeforeStart = activityStartTime.subtract(2, 'hour');
      if (now.isAfter(twoHoursBeforeStart)) {
        return next(appError(400, '距離活動開始已不足2小時，無法取消報名'));
      }

      const registration = await activitiesRegisterRepo.findOne({
        where: {
          member: { id: member.id },
          activity: { id: activityId },
        },
      });
      if (!registration) {
        return next(appError(404, '你尚未報名此活動'));
      }

      if (registration.status === 'cancelled') {
        return next(appError(409, '你已經取消報名此活動'));
      }

      registration.status = 'cancelled';
      await activitiesRegisterRepo.save(registration);

      member.points += activity.points * registration.participant_count;
      await membersRepo.save(member);

      activity.booked_count -= registration.participant_count;
      await activitiesRepo.save(activity);

      await pointsRecordRepo.save({
        member: { id: member.id },
        activity: { id: activity.id },
        points_change: activity.points * registration.participant_count,
        recordType: 'cancelAct',
      });
      await queryRunner.commitTransaction();
      res.status(200).json({
        message: '取消報名成功',
        registrationId: registration.id,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('取消報名活動錯誤:', error);
      next(error);
    } finally {
      await queryRunner.release();
    }
  },
  async updateRegistration(req, res, next) {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { id } = req.user;
      const { activityId, participantCount } = req.body;

      if (!isValidUUID(activityId) || !isValidUUID(id)) {
        return next(appError(400, 'ID未填寫正確'));
      }
      if (!isNumber(participantCount) || participantCount <= 0) {
        return next(appError(400, '報名人數未填寫正確，且必須大於 0'));
      }
      const membersRepo = queryRunner.manager.getRepository('Members');
      const activitiesRepo = queryRunner.manager.getRepository('Activities');
      const activitiesRegisterRepo = queryRunner.manager.getRepository('ActivitiesRegister');
      const pointsRecordRepo = queryRunner.manager.getRepository('PointsRecord');

      const member = await membersRepo.findOne({ where: { id } });
      if (!member) return next(appError(404, '會員不存在'));

      const activity = await activitiesRepo.findOne({
        where: { id: activityId, status: 'published' },
      });
      if (!activity) return next(appError(404, '活動不存在'));

      const now = dayjs().tz();
      const start = dayjs(activity.start_time).tz();
      const end = dayjs(activity.end_time).tz();
      if (end.isBefore(now)) return next(appError(400, '活動已結束，無法修改報名人數'));
      const twoHoursBeforeStart = start.subtract(2, 'hour');
      if (now.isAfter(twoHoursBeforeStart)) {
        return next(appError(400, '距離活動開始已不足2小時，無法修改報名人數'));
      }

      const registration = await activitiesRegisterRepo.findOne({
        where: {
          member: { id: member.id },
          activity: { id: activityId },
        },
      });
      if (!registration) return next(appError(404, '你尚未報名此活動'));

      if (registration.status === 'cancelled') {
        return next(appError(409, '你已經取消報名此活動，無法修改人數'));
      }

      const originalCount = registration.participant_count;
      if (registration.status === 'registered' && originalCount === participantCount) {
        return res.status(200).json({ message: '報名人數未變更' });
      }

      const diffCount = participantCount - originalCount;
      const diffPoints = activity.points * Math.abs(diffCount);

      const availableSlots = activity.participant_count - (activity.booked_count - originalCount);
      if (diffCount > 0 && participantCount > availableSlots) {
        return next(
          appError(
            400,
            `活動名額不足，剩餘 ${activity.participant_count - activity.booked_count} 人`,
          ),
        );
      }

      if (diffCount > 0 && member.points < diffPoints) {
        return next(appError(400, '點數不足'));
      }

      // 更新報名人數
      registration.participant_count = participantCount;
      await activitiesRegisterRepo.save(registration);
      // 更新活動已報名人數
      activity.booked_count += diffCount;
      await activitiesRepo.save(activity);
      // 更新會員點數
      if (diffCount > 0) {
        member.points -= diffPoints;
      } else {
        member.points += diffPoints;
      }
      await membersRepo.save(member);
      // 記錄點數變更
      await pointsRecordRepo.save({
        member: { id: member.id },
        activity: { id: activity.id },
        points_change: diffCount > 0 ? -diffPoints : diffPoints,
        recordType: 'applyAct',
      });
      await queryRunner.commitTransaction();
      res.status(200).json({
        message: '修改報名人數成功',
        registrationId: registration.id,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('修改報名人數錯誤:', error);
      next(error);
    } finally {
      await queryRunner.release();
    }
  },
};

module.exports = activityController;
