import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUserIDToProductTableAndAddRelationToThem1651826040814
  implements MigrationInterface
{
  name = 'addUserIDToProductTableAndAddRelationToThem1651826040814';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Product" ADD "UserID" integer NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "Product"."UserID" IS 'relation with user table as User.ID'`,
    );
    await queryRunner.query(
      `ALTER TABLE "Product" ADD CONSTRAINT "FK_255f97b323838e265028ec76d76" FOREIGN KEY ("UserID") REFERENCES "User"("ID") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Product" DROP CONSTRAINT "FK_255f97b323838e265028ec76d76"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "Product"."UserID" IS 'relation with user table as User.ID'`,
    );
    await queryRunner.query(`ALTER TABLE "Product" DROP COLUMN "UserID"`);
  }
}
