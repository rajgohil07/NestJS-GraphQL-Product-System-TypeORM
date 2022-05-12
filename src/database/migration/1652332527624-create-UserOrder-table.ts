import { MigrationInterface, QueryRunner } from "typeorm";

export class createUserOrderTable1652332527624 implements MigrationInterface {
    name = 'createUserOrderTable1652332527624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "UserOrder" ("ID" SERIAL NOT NULL, "CreatedDate" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedDate" TIMESTAMP NOT NULL DEFAULT now(), "UserID" integer NOT NULL, "ProductID" integer NOT NULL, CONSTRAINT "PK_123b0a439dde2c3f49b5930c0b5" PRIMARY KEY ("ID"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "UserOrder"`);
    }

}
