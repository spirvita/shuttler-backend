/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */

const { DEFAULT_POINTS_PLAN } = require('../seeds/seeding-data');
module.exports = class PointsSeeding1748420727347 {
  constructor() {
    this.name = 'PointsSeeding1748420727347';
  }

  async seedPointsPlan(queryRunner) {
    const pointsPlanRepo = queryRunner.manager.getRepository('PointsPlan');

    await pointsPlanRepo.save(DEFAULT_POINTS_PLAN);
  }

  async up(queryRunner) {
    await queryRunner.startTransaction();

    try {
      await this.seedPointsPlan(queryRunner);
      await queryRunner.commitTransaction();
      console.log('✓ PointsSeeding migration successfully');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('✘ PointsSeeding migration failed:', error.message);
      throw error;
    }
  }

  async down(queryRunner) {
    await queryRunner.query('DELETE FROM POINTS_PLAN');
  }
};
