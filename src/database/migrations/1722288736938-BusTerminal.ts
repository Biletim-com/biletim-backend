import { MigrationInterface, QueryRunner } from 'typeorm';

export class BusTerminal1722288736938 implements MigrationInterface {
  name = 'BusTerminal1722288736938';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bus_terminals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "external_id" integer NOT NULL, "city_id" integer NOT NULL, "country_code" character varying NOT NULL, "region" character varying, "name" character varying NOT NULL, "description" character varying, "is_center" boolean NOT NULL DEFAULT false, "affiliated_center_id" integer NOT NULL, "appear_in_search" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_8c32af999d66a8a25ba5230a119" UNIQUE ("external_id"), CONSTRAINT "PK_32ee1b972a5c4a253b1f4b797ff" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9a55f5aa74f6cb3d13651245c5" ON "bus_terminals" ("appear_in_search") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9a55f5aa74f6cb3d13651245c5"`,
    );
    await queryRunner.query(`DROP TABLE "bus_terminals"`);
  }
}
