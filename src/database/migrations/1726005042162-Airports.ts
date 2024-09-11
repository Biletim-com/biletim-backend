import { MigrationInterface, QueryRunner } from 'typeorm';

export class Airports1726005042162 implements MigrationInterface {
  name = 'Airports1726005042162';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "airports" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "country_code" character varying NOT NULL, "country_name" character varying NOT NULL, "country_name_en" character varying NOT NULL, "city_code" character varying NOT NULL, "city_name" character varying NOT NULL, "city_name_en" character varying NOT NULL, "airport_code" character varying NOT NULL, "airport_name" character varying NOT NULL, "airport_name_en" character varying NOT NULL, "airport_region" character varying, "airport_region_en" character varying, CONSTRAINT "UQ_59140df9903d4768759807fd258" UNIQUE ("airport_code"), CONSTRAINT "PK_507127316cedb7ec7447d0cb3d7" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "airports"`);
  }
}
