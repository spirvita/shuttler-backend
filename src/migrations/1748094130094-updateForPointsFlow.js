/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class UpdateForPointsFlow1748094130094 {
  constructor() {
    this.name = 'UpdateForPointsFlow1748094130094';
  }

  async up(queryRunner) {
    await queryRunner.query(`
            ALTER TABLE "POINTS_RECORD" DROP COLUMN "status"
        `);
    await queryRunner.query(`
            ALTER TABLE "MEMBERS"
            ADD "points" integer NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."POINTS_RECORD_recordtype_enum" AS ENUM(
                'addPoint',
                'applyAct',
                'cancelAct',
                'suspendAct'
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_RECORD"
            ADD "recordType" "public"."POINTS_RECORD_recordtype_enum" NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "ACTIVITIES_REGISTER"
            ADD "participant_count" integer NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "ACTIVITIES"
            ALTER COLUMN "status" DROP DEFAULT
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_RECORD" DROP COLUMN "created_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_RECORD"
            ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_RECORD" DROP COLUMN "updated_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_RECORD"
            ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_ORDER" DROP COLUMN "created_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_ORDER"
            ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_ORDER" DROP COLUMN "updated_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_ORDER"
            ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_PLAN" DROP COLUMN "created_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_PLAN"
            ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_PLAN" DROP COLUMN "updated_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_PLAN"
            ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "ACTIVITIES_REGISTER" DROP COLUMN "created_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "ACTIVITIES_REGISTER"
            ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "ACTIVITIES_REGISTER" DROP COLUMN "updated_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "ACTIVITIES_REGISTER"
            ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
            ALTER TABLE "ACTIVITIES_REGISTER" DROP COLUMN "updated_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "ACTIVITIES_REGISTER"
            ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "ACTIVITIES_REGISTER" DROP COLUMN "created_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "ACTIVITIES_REGISTER"
            ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_PLAN" DROP COLUMN "updated_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_PLAN"
            ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_PLAN" DROP COLUMN "created_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_PLAN"
            ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_ORDER" DROP COLUMN "updated_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_ORDER"
            ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_ORDER" DROP COLUMN "created_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_ORDER"
            ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_RECORD" DROP COLUMN "updated_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_RECORD"
            ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_RECORD" DROP COLUMN "created_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_RECORD"
            ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "ACTIVITIES"
            ALTER COLUMN "status" DROP DEFAULT
        `);
    await queryRunner.query(`
            ALTER TABLE "ACTIVITIES"
            ALTER COLUMN "status"
            SET DEFAULT 'draft'
        `);
    await queryRunner.query(`
            ALTER TABLE "ACTIVITIES_REGISTER" DROP COLUMN "participant_count"
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_RECORD" DROP COLUMN "recordType"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."POINTS_RECORD_recordtype_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "MEMBERS" DROP COLUMN "points"
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_RECORD"
            ADD "status" character varying(50) NOT NULL
        `);
  }
};
