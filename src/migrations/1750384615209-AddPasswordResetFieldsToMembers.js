/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class AddPasswordResetFieldsToMembers1750384615209 {
  constructor() {
    this.name = 'AddPasswordResetFieldsToMembers1750384615209';
  }

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "MEMBERS" ADD "reset_password_token" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "MEMBERS" ADD "reset_password_expiry" TIMESTAMP WITH TIME ZONE`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "MEMBERS" DROP COLUMN "reset_password_expiry"`);
    await queryRunner.query(`ALTER TABLE "MEMBERS" DROP COLUMN "reset_password_token"`);
  }
};
