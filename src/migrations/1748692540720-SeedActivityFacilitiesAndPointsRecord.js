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
    const activities = await queryRunner.query(`
      SELECT id FROM "ACTIVITIES" ORDER BY created_at
    `);

    const facilities = await queryRunner.query(`
      SELECT id FROM "FACILITIES" ORDER BY id
    `);

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

    let insertedCount = 0;

    // 使用原生 SQL 插入活動設施關聯
    for (const mapping of activityFacilityMappings) {
      if (activities[mapping.activityIndex]) {
        for (const facilityIndex of mapping.facilityIndexes) {
          if (facilities[facilityIndex]) {
            // 先檢查是否已存在（避免重複插入）
            const existing = await queryRunner.query(
              `SELECT id FROM "ACTIVITY_FACILITIES" 
               WHERE activity_id = $1 AND facility_id = $2`,
              [activities[mapping.activityIndex].id, facilities[facilityIndex].id],
            );

            if (existing.length === 0) {
              await queryRunner.query(
                `INSERT INTO "ACTIVITY_FACILITIES" 
                 (id, activity_id, facility_id, created_at, updated_at) 
                 VALUES 
                 (uuid_generate_v4(), $1, $2, NOW(), NOW())`,
                [activities[mapping.activityIndex].id, facilities[facilityIndex].id],
              );
              // eslint-disable-next-line no-unused-vars
              insertedCount++;
            }
          }
        }
      }
    }
  }

  async seedPointsRecord(queryRunner) {
    const members = await queryRunner.query(`
      SELECT id, name, email, points 
      FROM "MEMBERS"
    `);

    const pointsRecords = [
      { member_id: members[0].id, points_change: 10000, recordType: 'addPoint' },
      { member_id: members[1].id, points_change: 20000, recordType: 'addPoint' },
    ];

    members[0].points = 10000;
    members[1].points = 20000;

    await queryRunner.query(`UPDATE "MEMBERS" SET points = $1 WHERE id = $2`, [
      10000,
      members[0].id,
    ]);
    await queryRunner.query(`UPDATE "MEMBERS" SET points = $1 WHERE id = $2`, [
      20000,
      members[1].id,
    ]);

    for (const record of pointsRecords) {
      await queryRunner.query(
        `INSERT INTO "POINTS_RECORD" 
         (member_id, points_change, "recordType") 
         VALUES 
         ($1, $2, $3)`,
        [record.member_id, record.points_change, record.recordType],
      );
    }
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
    // 將 zip_code 從 VARCHAR 改回 INTEGER
    // 使用 USING 子句進行顯式轉換
    await queryRunner.query(
      `ALTER TABLE "ACTIVITIES" ALTER COLUMN "zip_code" TYPE INTEGER USING "zip_code"::INTEGER`,
    );
  }
};
