/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class SeedActivityFacilitiesAndPointsRecord1748692540720 {
  constructor() {
    this.name = 'SeedActivityFacilitiesAndPointsRecord1748692540720';
  }

  async seedActivityFacilities(queryRunner) {
    const activityRepo = queryRunner.manager.getRepository('Activities');
    const facilitiesRepo = queryRunner.manager.getRepository('Facilities');
    const activityFacilitiesRepo = queryRunner.manager.getRepository('ActivityFacilities');

    const activities = await activityRepo.find();
    const facilities = await facilitiesRepo.find();

    const activityFacilityMappings = [
      { activityIndex: 0, facilityIndexes: [0, 4, 7] },
      { activityIndex: 1, facilityIndexes: [0, 1, 2, 7] },
      { activityIndex: 2, facilityIndexes: [0, 1, 2, 7] },
      { activityIndex: 3, facilityIndexes: [1, 2, 7] },
      { activityIndex: 4, facilityIndexes: [0, 1, 2, 5] },
      { activityIndex: 5, facilityIndexes: [0, 1, 2, 7] },
      { activityIndex: 6, facilityIndexes: [0, 1, 2, 3] },
      { activityIndex: 7, facilityIndexes: [0, 1, 2, 4, 5, 6, 7] },
      { activityIndex: 8, facilityIndexes: [1, 2] },
      { activityIndex: 9, facilityIndexes: [0, 1, 2] },
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

  async seedPointsRecord(queryRunner) {
    const membersRepo = queryRunner.manager.getRepository('Members');
    const pointsRecordRepo = queryRunner.manager.getRepository('PointsRecord');

    const members = await membersRepo.find();

    const pointsRecords = [
      { member_id: members[0].id, points_change: 10000, recordType: 'addPoint' },
      { member_id: members[1].id, points_change: 20000, recordType: 'addPoint' },
    ];

    members[0].points = 10000;
    members[1].points = 20000;
    await membersRepo.save([members[0], members[1]]);

    await pointsRecordRepo.save(pointsRecords);
    console.log(`✓ PointsRecord seeding 完成 (${pointsRecords.length} 筆記錄)`);
  }

  async up(queryRunner) {
    await queryRunner.startTransaction();
    try {
      await queryRunner.query(`ALTER TABLE "ACTIVITIES" ALTER COLUMN "zip_code" TYPE VARCHAR(50)`);

      await Promise.all([
        this.seedActivityFacilities(queryRunner),
        this.seedPointsRecord(queryRunner),
      ]);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('✘ SeedActivityFacilitiesAndPointsRecord migration 執行失敗:', error);
      throw error;
    }
  }

  async down(queryRunner) {
    await queryRunner.query(`DELETE FROM "ACTIVITY_FACILITIES"`);
    await queryRunner.query(`DELETE FROM "POINTS_RECORD"`);
    await queryRunner.query(`ALTER TABLE "ACTIVITIES" ALTER COLUMN "zip_code" TYPE INTEGER`);
  }
};
