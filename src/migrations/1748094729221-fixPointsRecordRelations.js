/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class FixPointsRecordRelations1748094729221 {
  constructor() {
    this.name = 'FixPointsRecordRelations1748094729221';
  }

  async up(queryRunner) {
    await queryRunner.query(`
            ALTER TABLE "POINTS_RECORD" DROP CONSTRAINT "FK_50b22ec72fecece7fe7126ed38b"
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_RECORD"
            ALTER COLUMN "activity_id" DROP NOT NULL
        `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
            ALTER TABLE "POINTS_RECORD"
            ALTER COLUMN "activity_id"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_RECORD"
            ADD CONSTRAINT "FK_50b22ec72fecece7fe7126ed38b" FOREIGN KEY ("activity_id") REFERENCES "ACTIVITIES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
};
