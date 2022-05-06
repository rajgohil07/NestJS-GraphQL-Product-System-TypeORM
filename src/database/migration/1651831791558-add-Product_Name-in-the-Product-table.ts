import { MigrationInterface, QueryRunner } from 'typeorm';

export class addProductNameInTheProductTable1651831791558
  implements MigrationInterface
{
  name = 'addProductNameInTheProductTable1651831791558';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Product" ADD "Product_Name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "Product"."Product_Name" IS 'Name of the product'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "Product"."Product_Name" IS 'Name of the product'`,
    );
    await queryRunner.query(`ALTER TABLE "Product" DROP COLUMN "Product_Name"`);
  }
}
