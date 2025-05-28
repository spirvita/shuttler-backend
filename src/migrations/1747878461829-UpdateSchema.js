/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class UpdateSchema1747878461829 {
  constructor() {
    this.name = 'UpdateSchema1747878461829';
  }

  async up(queryRunner) {
    await queryRunner.query(`
      ALTER TABLE "ACTIVITIES" RENAME COLUMN "event_brief" TO "brief"
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITIES" DROP COLUMN "is_published"
    `);
    await queryRunner.query(`
      ALTER TABLE "MEMBERS" DROP COLUMN "created_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "MEMBERS" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    `);
    await queryRunner.query(`ALTER TABLE "MEMBERS" DROP COLUMN "updated_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "MEMBERS" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITIES" DROP COLUMN "start_time"
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITIES" ADD "start_time" TIMESTAMP WITH TIME ZONE NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITIES" DROP COLUMN "end_time"
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITIES" ADD "end_time" TIMESTAMP WITH TIME ZONE NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITIES" ALTER COLUMN "booked_count" SET DEFAULT '0'
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITIES" DROP COLUMN "contact_phone"
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITIES" ADD "contact_phone" character varying(50) NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITIES" DROP COLUMN "created_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITIES" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITIES" DROP COLUMN "updated_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITIES" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITY_PICTURES" DROP COLUMN "created_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITY_PICTURES" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITY_PICTURES" DROP COLUMN "updated_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITY_PICTURES" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITY_FACILITIES" DROP COLUMN "created_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITY_FACILITIES" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITY_FACILITIES" DROP COLUMN "updated_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITY_FACILITIES" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITY_LEVELS" DROP COLUMN "created_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITY_LEVELS" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITY_LEVELS" DROP COLUMN "updated_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITY_LEVELS" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    `);
    await queryRunner.query(`
      ALTER TABLE "MEMBER_FAVORITE_ACTIVITIES" DROP COLUMN "created_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "MEMBER_FAVORITE_ACTIVITIES" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
      ALTER TABLE "MEMBER_FAVORITE_ACTIVITIES" DROP COLUMN "created_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "MEMBER_FAVORITE_ACTIVITIES" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITY_LEVELS" DROP COLUMN "updated_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITY_LEVELS" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITY_LEVELS" DROP COLUMN "created_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITY_LEVELS" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITY_FACILITIES" DROP COLUMN "updated_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITY_FACILITIES" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITY_FACILITIES" DROP COLUMN "created_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITY_FACILITIES" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITY_PICTURES" DROP COLUMN "updated_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITY_PICTURES" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITY_PICTURES" DROP COLUMN "created_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITY_PICTURES" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITIES" DROP COLUMN "updated_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITIES" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITIES" DROP COLUMN "created_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITIES" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITIES" DROP COLUMN "contact_phone"
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITIES" ADD "contact_phone" integer NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITIES" ALTER COLUMN "booked_count" DROP DEFAULT
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITIES" DROP COLUMN "end_time"
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITIES" ADD "end_time" TIMESTAMP NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITIES" DROP COLUMN "start_time"
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITIES" ADD "start_time" TIMESTAMP NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "MEMBERS" DROP COLUMN "updated_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "MEMBERS" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    `);
    await queryRunner.query(`
      ALTER TABLE "MEMBERS" DROP COLUMN "created_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "MEMBERS" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITIES" DROP COLUMN "status"
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITIES" RENAME COLUMN "brief" TO "event_brief"
    `);
    await queryRunner.query(`
      ALTER TABLE "ACTIVITIES" ADD "is_published" boolean NOT NULL DEFAULT false
    `);
  }
};
