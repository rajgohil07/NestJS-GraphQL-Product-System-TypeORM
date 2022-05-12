import { MigrationInterface, QueryRunner } from 'typeorm';

export class addManyToManyRelations1652333947304 implements MigrationInterface {
  name = 'addManyToManyRelations1652333947304';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "UserOrder" ADD CONSTRAINT "FK_d7b35f0471ab6b0047e73a94e8e" FOREIGN KEY ("UserID") REFERENCES "User"("ID") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOrder" ADD CONSTRAINT "FK_0fbf1d75c984b1cb51389db2049" FOREIGN KEY ("ProductID") REFERENCES "Product"("ID") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "UserOrder" DROP CONSTRAINT "FK_0fbf1d75c984b1cb51389db2049"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOrder" DROP CONSTRAINT "FK_d7b35f0471ab6b0047e73a94e8e"`,
    );
  }
}
