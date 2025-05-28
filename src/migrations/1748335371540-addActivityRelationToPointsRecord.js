/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class AddActivityRelationToPointsRecord1748335371540 {
  constructor() {
    this.name = 'AddActivityRelationToPointsRecord1748335371540';
  }

  async up(queryRunner) {
    await queryRunner.query(`
            ALTER TABLE "POINTS_RECORD"
            ADD CONSTRAINT "FK_pointsrecord_activity"
            FOREIGN KEY ("activity_id") REFERENCES "ACTIVITIES"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
            ALTER TABLE "POINTS_RECORD"
            DROP CONSTRAINT "FK_pointsrecord_activity"
        `);
  }
};
