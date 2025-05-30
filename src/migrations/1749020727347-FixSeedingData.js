/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */

const { DEFAULT_CITIES, DEFAULT_FACILITIES } = require('../seeds/seeding-data');

module.exports = class FixSeedingData1749020727347 {
  constructor() {
    this.name = 'FixSeedingData1749020727347';
  }

  async up(queryRunner) {
    await queryRunner.startTransaction();

    try {
      // 刪除並重建城市資料
      await queryRunner.query(`DELETE FROM "CITIES"`);

      // 插入新的城市資料
      // 批量插入
      const cityValues = DEFAULT_CITIES.map(
        (city) => `('${city.zip_code}', '${city.city}', '${city.district}')`,
      ).join(', ');

      await queryRunner.query(`
        INSERT INTO "CITIES" (zip_code, city, district) 
        VALUES ${cityValues}
      `);

      // 刪除設施資料
      await queryRunner.query(`DELETE FROM "ACTIVITY_FACILITIES"`);
      await queryRunner.query(`DELETE FROM "FACILITIES"`);

      // 插入新設施資料
      for (const facility of DEFAULT_FACILITIES) {
        await queryRunner.query(
          `INSERT INTO "FACILITIES" (id, name) VALUES (uuid_generate_v4(), $1)`,
          [facility.name],
        );
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('✘ ResetCitiesAndFacilities migration 執行失敗:', error);
      throw error;
    }
  }

  async down(queryRunner) {
    console.log('FixSeedingData1749020727347 為重置資料，無需回滾操作。');
    // 此遷移不需要回滾操作，因為它是用來重置資料的
  }
};
