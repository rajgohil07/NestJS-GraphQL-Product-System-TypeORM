import { MigrationInterface, QueryRunner } from "typeorm";

export class createProductTable1651824851355 implements MigrationInterface {
    name = 'createProductTable1651824851355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Product" ("ID" SERIAL NOT NULL, "CreatedDate" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedDate" TIMESTAMP NOT NULL DEFAULT now(), "Price" double precision NOT NULL, "IN_Stock" boolean NOT NULL, CONSTRAINT "PK_5c22f7d26ece7d5803215e58c1e" PRIMARY KEY ("ID")); COMMENT ON COLUMN "Product"."ID" IS 'Primary key of product table'; COMMENT ON COLUMN "Product"."CreatedDate" IS 'Store the date of creation operation'; COMMENT ON COLUMN "Product"."UpdatedDate" IS 'Store the date of update operation'; COMMENT ON COLUMN "Product"."Price" IS 'Price of the product per unit'; COMMENT ON COLUMN "Product"."IN_Stock" IS 'To specify weather the product is in stock or not'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Product"`);
    }

}
