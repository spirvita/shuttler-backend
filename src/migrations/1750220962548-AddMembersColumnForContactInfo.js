/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class AddMembersColumnForContactInfo1750220962548 {
  constructor() {
    this.name = 'AddMembersColumnForContactInfo1750220962548';
  }

  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "MEMBERS" ADD "organization" character varying(100)`);
    await queryRunner.query(`ALTER TABLE "MEMBERS" ADD "phone" character varying(15)`);

    // Update existing members with default values for organization and phone
    await queryRunner.query(
      `UPDATE "MEMBERS" 
       SET "organization" = $1, "phone" = $2 
       WHERE "email" = $3`,
      ['godminton', '0912345678', 'example1@example.com'],
    );

    await queryRunner.query(
      `UPDATE "MEMBERS" 
       SET "organization" = $1, "phone" = $2 
       WHERE "email" = $3`,
      ['羽神共舞', '0987654321', 'example2@example.com'],
    );
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "MEMBERS" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "MEMBERS" DROP COLUMN "organization"`);
  }
};
