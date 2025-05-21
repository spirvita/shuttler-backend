/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class AddNewSchema1747821161513 {
  constructor() {
    this.name = 'AddNewSchema1747821161513';
  }

  async up(queryRunner) {
    await queryRunner.query(`
            CREATE TABLE "POINTS_RECORD" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "activity_id" uuid NOT NULL,
                "member_id" uuid NOT NULL,
                "points_change" integer NOT NULL,
                "status" character varying(50) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_937dc437bf76312b7c001b30224" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "POINTS_ORDER" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "member_id" uuid NOT NULL,
                "points_plan_id" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_2b584626e8186b9b7f06343f249" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "POINTS_PLAN" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "points" integer NOT NULL,
                "value" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_558894133bd81beafcfc8dc7a5d" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "ACTIVITIES_REGISTER" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "activity_id" uuid NOT NULL,
                "member_id" uuid NOT NULL,
                "status" character varying(50) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_633c8f40bb1a5494ddc88576868" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_RECORD"
            ADD CONSTRAINT "FK_50b22ec72fecece7fe7126ed38b" FOREIGN KEY ("activity_id") REFERENCES "ACTIVITIES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_RECORD"
            ADD CONSTRAINT "FK_6fd5aabdacdfc98963202f9cf5b" FOREIGN KEY ("member_id") REFERENCES "MEMBERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_ORDER"
            ADD CONSTRAINT "FK_b8fd5a1dafb2612c7511d903222" FOREIGN KEY ("member_id") REFERENCES "MEMBERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_ORDER"
            ADD CONSTRAINT "FK_bdf90959fa7664b28b3308f48a5" FOREIGN KEY ("points_plan_id") REFERENCES "POINTS_PLAN"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "ACTIVITIES_REGISTER"
            ADD CONSTRAINT "FK_1343ba510c8f2808dc055b409ae" FOREIGN KEY ("activity_id") REFERENCES "ACTIVITIES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "ACTIVITIES_REGISTER"
            ADD CONSTRAINT "FK_05f8c8c6f48601169e6f8b79676" FOREIGN KEY ("member_id") REFERENCES "MEMBERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
            ALTER TABLE "ACTIVITIES_REGISTER" DROP CONSTRAINT "FK_05f8c8c6f48601169e6f8b79676"
        `);
    await queryRunner.query(`
            ALTER TABLE "ACTIVITIES_REGISTER" DROP CONSTRAINT "FK_1343ba510c8f2808dc055b409ae"
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_ORDER" DROP CONSTRAINT "FK_bdf90959fa7664b28b3308f48a5"
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_ORDER" DROP CONSTRAINT "FK_b8fd5a1dafb2612c7511d903222"
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_RECORD" DROP CONSTRAINT "FK_6fd5aabdacdfc98963202f9cf5b"
        `);
    await queryRunner.query(`
            ALTER TABLE "POINTS_RECORD" DROP CONSTRAINT "FK_50b22ec72fecece7fe7126ed38b"
        `);
    await queryRunner.query(`
            DROP TABLE "ACTIVITIES_REGISTER"
        `);
    await queryRunner.query(`
            DROP TABLE "POINTS_PLAN"
        `);
    await queryRunner.query(`
            DROP TABLE "POINTS_ORDER"
        `);
    await queryRunner.query(`
            DROP TABLE "POINTS_RECORD"
        `);
  }
};
