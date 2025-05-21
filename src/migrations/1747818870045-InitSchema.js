/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class InitSchema1747818870045 {
  constructor() {
    this.name = 'InitSchema1747818870045';
  }

  async up(queryRunner) {
    await queryRunner.query(`
            CREATE TABLE "MEMBERS" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                
                "name" character varying(50) NOT NULL,
                "email" character varying(320) NOT NULL,
                "password" character varying(72) NOT NULL,
                "photo" text,
                "level_id" uuid,
                "region" character varying(50) array,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_0f0aadc72d8f5b39a85e4053381" UNIQUE ("email"),
                CONSTRAINT "PK_0f51565dcc6fabd22fe971dbc3f" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "ACTIVITIES" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "member_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(50) NOT NULL,
                "start_time" TIMESTAMP NOT NULL,
                "end_time" TIMESTAMP NOT NULL,
                "venue_name" character varying(50) NOT NULL,
                "zip_code" integer NOT NULL,
                "address" character varying(255) NOT NULL,
                "ball_type" character varying(50) NOT NULL,
                "participant_count" integer NOT NULL,
                "booked_count" integer NOT NULL,
                "rental_lot" integer NOT NULL,
                "event_brief" text NOT NULL,
                "contact_name" character varying(50) NOT NULL,
                "contact_phone" integer NOT NULL,
                "contact_line" character varying(50) NOT NULL,
                "points" integer NOT NULL,
                "is_published" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_4ea732a34ebe9cc5d309c475907" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "ACTIVITY_PICTURES" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "activity_id" uuid NOT NULL,
                "url" text NOT NULL,
                "sort_order" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_ff4c6af1be61d38d37835aed592" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "FACILITIES" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(50) NOT NULL,
                CONSTRAINT "PK_9b5299dab758eae5a6ba4887cad" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "ACTIVITY_FACILITIES" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "activity_id" uuid NOT NULL,
                "facility_id" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_53d71f8ddf4aa157265238715e4" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "LEVELS" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "level" integer NOT NULL,
                "name" character varying(50) NOT NULL,
                CONSTRAINT "PK_ea02009688d01bbcb20ff945422" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "ACTIVITY_LEVELS" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "activity_id" uuid NOT NULL,
                "level_id" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_a8c466a5981a726c84e8b9bc162" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "CITIES" (
                "zip_code" character varying(10) NOT NULL,
                "city" character varying(10) NOT NULL,
                "district" character varying(10) NOT NULL,
                CONSTRAINT "PK_d63f92e8983887bf20b08415b7a" PRIMARY KEY ("zip_code")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "MEMBER_FAVORITE_ACTIVITIES" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "member_id" uuid NOT NULL,
                "activity_id" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_848acce1948aab1ca4f664e9abc" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "MEMBERS"
            ADD CONSTRAINT "FK_39e10339d7889d3535d3b6693a4" FOREIGN KEY ("level_id") REFERENCES "LEVELS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "ACTIVITIES"
            ADD CONSTRAINT "FK_56ddcc70a488c83bdbf5fde7df8" FOREIGN KEY ("member_id") REFERENCES "MEMBERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "ACTIVITY_PICTURES"
            ADD CONSTRAINT "FK_0ca4c57876842b50544b214a488" FOREIGN KEY ("activity_id") REFERENCES "ACTIVITIES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "ACTIVITY_FACILITIES"
            ADD CONSTRAINT "FK_195c5ff4a8292dd13a161e207f4" FOREIGN KEY ("activity_id") REFERENCES "ACTIVITIES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "ACTIVITY_FACILITIES"
            ADD CONSTRAINT "FK_b6c58672bef84790c926ce8f4bc" FOREIGN KEY ("facility_id") REFERENCES "FACILITIES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "ACTIVITY_LEVELS"
            ADD CONSTRAINT "FK_61f9e8cc34ce5831aa4757a347d" FOREIGN KEY ("activity_id") REFERENCES "ACTIVITIES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "ACTIVITY_LEVELS"
            ADD CONSTRAINT "FK_cb472bad6276614e2eddda403d1" FOREIGN KEY ("level_id") REFERENCES "LEVELS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "MEMBER_FAVORITE_ACTIVITIES"
            ADD CONSTRAINT "FK_d362a5271fa466938311117c072" FOREIGN KEY ("member_id") REFERENCES "MEMBERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "MEMBER_FAVORITE_ACTIVITIES"
            ADD CONSTRAINT "FK_050608c27a1c1974a61097d6a5d" FOREIGN KEY ("activity_id") REFERENCES "ACTIVITIES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
            ALTER TABLE "MEMBER_FAVORITE_ACTIVITIES" DROP CONSTRAINT "FK_050608c27a1c1974a61097d6a5d"
        `);
    await queryRunner.query(`
            ALTER TABLE "MEMBER_FAVORITE_ACTIVITIES" DROP CONSTRAINT "FK_d362a5271fa466938311117c072"
        `);
    await queryRunner.query(`
            ALTER TABLE "ACTIVITY_LEVELS" DROP CONSTRAINT "FK_cb472bad6276614e2eddda403d1"
        `);
    await queryRunner.query(`
            ALTER TABLE "ACTIVITY_LEVELS" DROP CONSTRAINT "FK_61f9e8cc34ce5831aa4757a347d"
        `);
    await queryRunner.query(`
            ALTER TABLE "ACTIVITY_FACILITIES" DROP CONSTRAINT "FK_b6c58672bef84790c926ce8f4bc"
        `);
    await queryRunner.query(`
            ALTER TABLE "ACTIVITY_FACILITIES" DROP CONSTRAINT "FK_195c5ff4a8292dd13a161e207f4"
        `);
    await queryRunner.query(`
            ALTER TABLE "ACTIVITY_PICTURES" DROP CONSTRAINT "FK_0ca4c57876842b50544b214a488"
        `);
    await queryRunner.query(`
            ALTER TABLE "ACTIVITIES" DROP CONSTRAINT "FK_56ddcc70a488c83bdbf5fde7df8"
        `);
    await queryRunner.query(`
            ALTER TABLE "MEMBERS" DROP CONSTRAINT "FK_39e10339d7889d3535d3b6693a4"
        `);
    await queryRunner.query(`
            DROP TABLE "MEMBER_FAVORITE_ACTIVITIES"
        `);
    await queryRunner.query(`
            DROP TABLE "CITIES"
        `);
    await queryRunner.query(`
            DROP TABLE "ACTIVITY_LEVELS"
        `);
    await queryRunner.query(`
            DROP TABLE "LEVELS"
        `);
    await queryRunner.query(`
            DROP TABLE "ACTIVITY_FACILITIES"
        `);
    await queryRunner.query(`
            DROP TABLE "FACILITIES"
        `);
    await queryRunner.query(`
            DROP TABLE "ACTIVITY_PICTURES"
        `);
    await queryRunner.query(`
            DROP TABLE "ACTIVITIES"
        `);
    await queryRunner.query(`
            DROP TABLE "MEMBERS"
        `);
  }
};
