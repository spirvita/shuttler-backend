/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */

const { DEFAULT_LEVELS, DEFAULT_CITIES, DEFAULT_FACILITIES } = require('../seeds/seeding-data');

module.exports = class StableObjSeeding1748420727343 {
  constructor() {
    this.name = 'StableObjSeeding1748420727343';
  }

  async validateTables(queryRunner) {
    const requiredTables = ['LEVELS', 'CITIES', 'FACILITIES'];

    for (const tableName of requiredTables) {
      const exists = await queryRunner.hasTable(tableName);
      if (!exists) {
        throw new Error(`表 ${tableName} 不存在，請先執行 schema migration`);
      }
    }

    console.log('✓ 所有必要的表都已存在');
  }

  async seedLevels(queryRunner) {
    const levelsRepo = queryRunner.manager.getRepository('Levels');
    // 批量檢查現有 levels
    const existingLevels = await levelsRepo.find();
    const existingLevelNumbers = new Set(existingLevels.map((l) => l.level));
    // 過濾出需要插入的新 levels
    const newLevels = DEFAULT_LEVELS.filter((level) => !existingLevelNumbers.has(level.level));
    if (newLevels.length > 0) {
      await levelsRepo.save(newLevels);
      console.log(`✓ Insert ${newLevels.length} levels`);
    }
  }

  async seedCities(queryRunner) {
    const cityValues = DEFAULT_CITIES.map(
      (city) => `('${city.zip_code}', '${city.city}', '${city.district}')`,
    ).join(', ');

    try {
      await queryRunner.query(`
        INSERT INTO "CITIES" (zip_code, city, district) 
        VALUES ${cityValues}
        ON CONFLICT (zip_code) DO NOTHING
      `);
      console.log('✓ Cities seeding 完成');
    } catch (error) {
      console.error('✘ Cities seeding 失敗:', error.message);
      throw error;
    }
  }

  async seedFacilities(queryRunner) {
    const facilitiesRepo = queryRunner.manager.getRepository('Facilities');

    // 批量檢查現有 facilities
    const existingFacilities = await facilitiesRepo.find();
    const existingNames = new Set(existingFacilities.map((f) => f.name));

    // 過濾出需要插入的新 facilities
    const newFacilities = DEFAULT_FACILITIES.filter(
      (facility) => !existingNames.has(facility.name),
    );

    if (newFacilities.length > 0) {
      await facilitiesRepo.save(newFacilities);
      console.log(`✓ Insert ${newFacilities.length} facilities`);
    }
  }

  async up(queryRunner) {
    await this.validateTables(queryRunner);
    await queryRunner.startTransaction();

    try {
      await this.seedLevels(queryRunner);
      await this.seedCities(queryRunner);
      await this.seedFacilities(queryRunner);

      await queryRunner.commitTransaction();
      console.log('✓ StableObjSeeding migration successfully.');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('✘ StableObjSeeding migration FAILED', error.message);
      throw error;
    }
  }

  async down(queryRunner) {
    // 使用參數化查詢來安全刪除資料
    const levelNumbers = DEFAULT_LEVELS.map((l) => l.level);
    const zipCodes = DEFAULT_CITIES.map((c) => c.zip_code);
    const facilityNames = DEFAULT_FACILITIES.map((f) => f.name);

    await queryRunner.query('DELETE FROM FACILITIES WHERE name = ANY($1)', [facilityNames]);
    await queryRunner.query('DELETE FROM CITIES WHERE zip_code = ANY($1)', [zipCodes]);
    await queryRunner.query('DELETE FROM LEVELS WHERE level = ANY($1)', [levelNumbers]);
  }
};
