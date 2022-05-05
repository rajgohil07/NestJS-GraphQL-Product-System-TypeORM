import { MigrationInterface, QueryRunner } from 'typeorm';

export class addEmailPasswordToUser1651726789136 implements MigrationInterface {
  name = 'addEmailPasswordToUser1651726789136';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "User" ADD "CreatedDate" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "User" ADD "UpdatedDate" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "User" ADD "Email" character varying NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "User"."Email" IS 'Provided email of the user'`,
    );
    await queryRunner.query(`ALTER TABLE "User" ADD "Password" text NOT NULL`);
    await queryRunner.query(
      `COMMENT ON COLUMN "User"."Password" IS 'hashed password of the user'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "User"."Password" IS 'hashed password of the user'`,
    );
    await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "Password"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "User"."Email" IS 'Provided email of the user'`,
    );
    await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "Email"`);
    await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "UpdatedDate"`);
    await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "CreatedDate"`);
  }
}
