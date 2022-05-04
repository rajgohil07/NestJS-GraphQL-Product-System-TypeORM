import { MigrationInterface, QueryRunner } from "typeorm";

export class createUserTable1651639068544 implements MigrationInterface {
    name = 'createUserTable1651639068544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "User" ("ID" SERIAL NOT NULL, "Name" character varying NOT NULL, CONSTRAINT "PK_7c38bb872c3c617c80a311b81d0" PRIMARY KEY ("ID")); COMMENT ON COLUMN "User"."Name" IS 'Name of the user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "User"`);
    }

}
