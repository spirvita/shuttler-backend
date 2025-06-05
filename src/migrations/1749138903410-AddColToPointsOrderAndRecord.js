/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class AddColToPointsOrderAndRecord1749138903410 {
  constructor() {
    this.name = 'AddColToPointsOrderAndRecord1749138903410';
  }

  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "POINTS_RECORD" ADD "points_order_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "POINTS_RECORD" ADD CONSTRAINT "UQ_904e4382aa322aee807717c7c3f" UNIQUE ("points_order_id")`,
    );
    await queryRunner.query(`ALTER TABLE "POINTS_ORDER" ADD "trade_no" character varying(255)`);
    await queryRunner.query(
      `ALTER TABLE "POINTS_ORDER" ADD CONSTRAINT "UQ_f091e62478475711a4094146fbc" UNIQUE ("trade_no")`,
    );
    await queryRunner.query(`ALTER TABLE "POINTS_ORDER" ADD "pay_time" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`ALTER TABLE "POINTS_ORDER" ADD "amount" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "POINTS_ORDER" ADD "merchant_order_no" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "POINTS_ORDER" ADD CONSTRAINT "UQ_77dce639fd60d7e3f87cbe0608a" UNIQUE ("merchant_order_no")`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."POINTS_ORDER_status_enum" AS ENUM('pending', 'completed', 'failed')`,
    );
    await queryRunner.query(
      `ALTER TABLE "POINTS_ORDER" ADD "status" "public"."POINTS_ORDER_status_enum" NOT NULL DEFAULT 'pending'`,
    );
    await queryRunner.query(
      `ALTER TABLE "POINTS_RECORD" ADD CONSTRAINT "FK_904e4382aa322aee807717c7c3f" FOREIGN KEY ("points_order_id") REFERENCES "POINTS_ORDER"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "POINTS_RECORD" DROP CONSTRAINT "FK_904e4382aa322aee807717c7c3f"`,
    );

    await queryRunner.query(`ALTER TABLE "POINTS_ORDER" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."POINTS_ORDER_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "POINTS_ORDER" DROP CONSTRAINT "UQ_77dce639fd60d7e3f87cbe0608a"`,
    );
    await queryRunner.query(`ALTER TABLE "POINTS_ORDER" DROP COLUMN "merchant_order_no"`);
    await queryRunner.query(`ALTER TABLE "POINTS_ORDER" DROP COLUMN "amount"`);
    await queryRunner.query(`ALTER TABLE "POINTS_ORDER" DROP COLUMN "pay_time"`);
    await queryRunner.query(
      `ALTER TABLE "POINTS_ORDER" DROP CONSTRAINT "UQ_f091e62478475711a4094146fbc"`,
    );
    await queryRunner.query(`ALTER TABLE "POINTS_ORDER" DROP COLUMN "trade_no"`);
    await queryRunner.query(
      `ALTER TABLE "POINTS_RECORD" DROP CONSTRAINT "UQ_904e4382aa322aee807717c7c3f"`,
    );
    await queryRunner.query(`ALTER TABLE "POINTS_RECORD" DROP COLUMN "points_order_id"`);
  }
};
