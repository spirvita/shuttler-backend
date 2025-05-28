/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class addOrganizerAndMakeBriefContactNullable1748415205901 {
  constructor() {
    this.name = 'addOrganizerAndMakeBriefContactNullable1748415205901';
  }

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "POINTS_RECORD" DROP CONSTRAINT "FK_pointsrecord_activity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ACTIVITIES" ADD "organizer" character varying(50) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "ACTIVITIES" ALTER COLUMN "brief" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "ACTIVITIES" ALTER COLUMN "contact_line" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "ACTIVITIES" ALTER COLUMN "status" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "ACTIVITIES" ALTER COLUMN "status" SET DEFAULT 'draft'`);
    await queryRunner.query(
      `ALTER TABLE "POINTS_RECORD" ADD CONSTRAINT "FK_50b22ec72fecece7fe7126ed38b" FOREIGN KEY ("activity_id") REFERENCES "ACTIVITIES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "POINTS_RECORD" DROP CONSTRAINT "FK_50b22ec72fecece7fe7126ed38b"`,
    );
    await queryRunner.query(`ALTER TABLE "ACTIVITIES" ALTER COLUMN "status" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "ACTIVITIES" ALTER COLUMN "status" SET DEFAULT 'draft'`);
    await queryRunner.query(`ALTER TABLE "ACTIVITIES" ALTER COLUMN "contact_line" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "ACTIVITIES" ALTER COLUMN "brief" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "ACTIVITIES" DROP COLUMN "organizer"`);
    await queryRunner.query(
      `ALTER TABLE "POINTS_RECORD" ADD CONSTRAINT "FK_pointsrecord_activity" FOREIGN KEY ("activity_id") REFERENCES "ACTIVITIES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
};
