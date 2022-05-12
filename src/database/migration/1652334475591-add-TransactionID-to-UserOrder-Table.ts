import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTransactionIDToUserOrderTable1652334475591
  implements MigrationInterface
{
  name = 'addTransactionIDToUserOrderTable1652334475591';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "UserOrder" ADD "TransactionID" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOrder" ADD CONSTRAINT "UQ_6944f2914ff1f9f93cdc377cd8a" UNIQUE ("TransactionID")`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "UserOrder"."TransactionID" IS 'TransactionID for specific order'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "UserOrder"."TransactionID" IS 'TransactionID for specific order'`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOrder" DROP CONSTRAINT "UQ_6944f2914ff1f9f93cdc377cd8a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOrder" DROP COLUMN "TransactionID"`,
    );
  }
}
