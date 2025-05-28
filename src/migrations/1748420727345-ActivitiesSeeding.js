/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
const { DEFAULT_ACTIVITIES } = require('../seeds/seeding-data');

module.exports = class ActivitiesSeeding1748420727345 {
  constructor() {
    this.name = 'ActivitiesSeeding1748420727345';
  }

  async seedActivities(queryRunner) {
    const activitiesRepo = queryRunner.manager.getRepository('Activities');
    const membersRepo = queryRunner.manager.getRepository('Members');

    const members = await membersRepo.find();

    // 準備活動資料，分配給不同會員
    const activitiesData = DEFAULT_ACTIVITIES.map((activity, index) => ({
      ...activity,
      member_id: members[index % members.length].id,
    }));

    const savedActivities = await activitiesRepo.save(activitiesData);
    console.log(`✓ Insert ${savedActivities.length} activities`);
    return savedActivities;
  }

  async seedActivityLevels(queryRunner, activities) {
    const levelsRepo = queryRunner.manager.getRepository('Levels');
    const levels = await levelsRepo.find();

    const defaultActivityLevels = [
      { activity_id: activities[0].id, level_id: levels[0].id },
      { activity_id: activities[0].id, level_id: levels[3].id },
      { activity_id: activities[1].id, level_id: levels[2].id },
      { activity_id: activities[2].id, level_id: levels[4].id },
      { activity_id: activities[2].id, level_id: levels[5].id },
      { activity_id: activities[3].id, level_id: levels[0].id },
      { activity_id: activities[4].id, level_id: levels[2].id },
      { activity_id: activities[5].id, level_id: levels[0].id },
      { activity_id: activities[6].id, level_id: levels[0].id },
      { activity_id: activities[7].id, level_id: levels[0].id },
      { activity_id: activities[7].id, level_id: levels[1].id },
      { activity_id: activities[8].id, level_id: levels[1].id },
      { activity_id: activities[8].id, level_id: levels[2].id },
      { activity_id: activities[9].id, level_id: levels[2].id },
      { activity_id: activities[9].id, level_id: levels[3].id },
    ];

    const activityLevelsData = [];
    defaultActivityLevels.forEach((mapping) => {
      if (activities[mapping.activityIndex]) {
        mapping.levelIndexes.forEach((levelIndex) => {
          if (levels[levelIndex]) {
            activityLevelsData.push({
              activity_id: activities[mapping.activityIndex].id,
              level_id: levels[levelIndex].id,
            });
          }
        });
      }
    });

    // 使用批量 UPSERT 避免重複插入
    for (const data of activityLevelsData) {
      await queryRunner.query(
        `
        INSERT INTO "ACTIVITY_LEVELS" (activity_id, level_id, created_at, updated_at) 
        VALUES ($1, $2, NOW(), NOW())
        ON CONFLICT (activity_id, level_id) DO NOTHING
      `,
        [data.activity_id, data.level_id],
      );
    }
  }

  async seedActivityFacilities(queryRunner, activities) {
    const facilitiesRepo = queryRunner.manager.getRepository('Facilities');
    const activityFacilitiesRepo = queryRunner.manager.getRepository('ActivityFacilities');

    const facilities = await facilitiesRepo.find();

    // 定義活動與設施的關聯關係
    const activityFacilityMappings = [
      { activityIndex: 0, facilityIndexes: [0, 4, 7] }, // 歡樂團
      { activityIndex: 1, facilityIndexes: [0, 1, 2, 7] }, // 晨練羽球會
      { activityIndex: 2, facilityIndexes: [0, 1, 2, 7] }, // 週末大亂鬥
      { activityIndex: 3, facilityIndexes: [1, 2, 7] }, // 輕鬆下午打
      { activityIndex: 4, facilityIndexes: [0, 1, 2, 5] }, // 夜貓子羽球團
      { activityIndex: 5, facilityIndexes: [0, 1, 2, 7] }, // 新手教學團
      { activityIndex: 6, facilityIndexes: [0, 1, 2, 3] }, // 假日親子場
      { activityIndex: 7, facilityIndexes: [0, 1, 2, 4, 5, 6, 7] }, // 學生特惠團
      { activityIndex: 8, facilityIndexes: [1, 2] }, // 女子限定羽球團
      { activityIndex: 9, facilityIndexes: [0, 1, 2] }, // 中午快打團
    ];

    const activityFacilitiesData = [];
    activityFacilityMappings.forEach((mapping) => {
      mapping.facilityIndexes.forEach((facilityIndex) => {
        activityFacilitiesData.push({
          activity_id: activities[mapping.activityIndex].id,
          facility_id: facilities[facilityIndex].id,
        });
      });
    });

    if (activityFacilitiesData.length > 0) {
      await activityFacilitiesRepo.save(activityFacilitiesData);
      console.log(`✓ ActivityFacilities seeding 完成 (${activityFacilitiesData.length} 筆關聯)`);
    }
  }

  async seedActivityPictures(queryRunner, activities) {
    const defaultImageUrl =
      'https://images.unsplash.com/photo-1617696618050-b0fef0c666af?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

    // 定義每個活動的圖片數量
    const activityPictureConfigs = [
      { activityIndex: 0, pictureCount: 5 },
      { activityIndex: 1, pictureCount: 2 },
      { activityIndex: 2, pictureCount: 1 },
      { activityIndex: 3, pictureCount: 1 },
      { activityIndex: 4, pictureCount: 3 },
      { activityIndex: 5, pictureCount: 1 },
      { activityIndex: 6, pictureCount: 2 },
      { activityIndex: 7, pictureCount: 4 },
      { activityIndex: 8, pictureCount: 1 },
      { activityIndex: 9, pictureCount: 2 },
    ];

    const activityPicturesData = [];
    activityPictureConfigs.forEach((config) => {
      if (activities[config.activityIndex]) {
        for (let i = 1; i <= config.pictureCount; i++) {
          activityPicturesData.push({
            activity_id: activities[config.activityIndex].id,
            url: defaultImageUrl,
            sort_order: i,
          });
        }
      }
    });

    const activityPicturesRepo = queryRunner.manager.getRepository('ActivityPictures');
    await activityPicturesRepo.save(activityPicturesData);

    console.log(`✓ ActivityPictures seeding 完成 (${activityPicturesData.length} 張圖片)`);
  }

  async up(queryRunner) {
    await queryRunner.startTransaction();

    try {
      const activities = await this.seedActivities(queryRunner);

      await Promise.all([
        this.seedActivityLevels(queryRunner, activities),
        this.seedActivityFacilities(queryRunner, activities),
        this.seedActivityPictures(queryRunner, activities),
      ]);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('✘ ActivitiesSeeding migration Failed:', error);
      throw error;
    }
  }

  async down(queryRunner) {
    // 按依賴順序刪除，避免外鍵約束錯誤
    await queryRunner.query('DELETE FROM ACTIVITY_PICTURES');
    await queryRunner.query('DELETE FROM ACTIVITY_LEVELS');
    await queryRunner.query('DELETE FROM ACTIVITY_FACILITIES');
    await queryRunner.query('DELETE FROM ACTIVITIES');
  }
};
