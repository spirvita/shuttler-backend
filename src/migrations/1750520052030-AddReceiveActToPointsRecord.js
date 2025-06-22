/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class AddReceiveActToPointsRecord1750520052030 {
  async up(queryRunner) {
    await queryRunner.query(`
          ALTER TYPE "POINTS_RECORD_recordtype_enum"
          ADD VALUE 'receiveAct'
        `);
  }

  async down(queryRunner) {
    // 1. 建立不含 receiveAct 的暫時 enum type
    await queryRunner.query(`
      CREATE TYPE "POINTS_RECORD_recordtype_enum_tmp" AS ENUM (
        'addPoint',
        'applyAct',
        'cancelAct',
        'suspendAct'
      )
    `);

    // 2. 將原欄位改成新的 enum type（需 cast）
    await queryRunner.query(`
      ALTER TABLE "POINTS_RECORD"
      ALTER COLUMN "recordType"
      TYPE "POINTS_RECORD_recordtype_enum_tmp"
      USING "recordType"::text::"POINTS_RECORD_recordtype_enum_tmp"
    `);

    // 3. 刪除原本含有 receiveAct 的 enum
    await queryRunner.query(`
      DROP TYPE "POINTS_RECORD_recordtype_enum"
    `);

    // 4. 將 tmp enum 改回原本的名稱
    await queryRunner.query(`
      ALTER TYPE "POINTS_RECORD_recordtype_enum_tmp"
      RENAME TO "POINTS_RECORD_recordtype_enum"
    `);
  }
};
