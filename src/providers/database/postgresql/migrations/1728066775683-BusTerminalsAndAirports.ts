import { MigrationInterface, QueryRunner } from 'typeorm';

export class BusTerminalsAndAirports1728066775683
  implements MigrationInterface
{
  name = 'BusTerminalsAndAirports1728066775683';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // airports
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        'biletim',
        'public',
        'airports',
        'GENERATED_COLUMN',
        'search_text',
        "\n        to_tsvector('simple', \n          country_name || ' ' || \n          country_name_en || ' ' || \n          city_name || ' ' || \n          city_name_en || ' ' || \n          airport_code || ' ' || \n          airport_name || ' ' || \n          airport_name_en\n        )",
      ],
    );
    await queryRunner.query(`CREATE TABLE "airports" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "country_code" character varying NOT NULL, "country_name" character varying NOT NULL, "country_name_en" character varying NOT NULL, "city_code" character varying NOT NULL, "city_name" character varying NOT NULL, "city_name_en" character varying NOT NULL, "airport_code" character varying NOT NULL, "airport_name" character varying NOT NULL, "airport_name_en" character varying NOT NULL, "airport_region" character varying, "airport_region_en" character varying, "search_text" tsvector GENERATED ALWAYS AS (
        to_tsvector('simple', 
          country_name || ' ' || 
          country_name_en || ' ' || 
          city_name || ' ' || 
          city_name_en || ' ' || 
          airport_code || ' ' || 
          airport_name || ' ' || 
          airport_name_en
        )) STORED, CONSTRAINT "UQ_59140df9903d4768759807fd258" UNIQUE ("airport_code"), CONSTRAINT "PK_507127316cedb7ec7447d0cb3d7" PRIMARY KEY ("id"))`);
    await queryRunner.query(
      'CREATE INDEX "city_airport_text_idx" ON "airports" USING GIN (search_text)',
    );

    // bus terminals
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        'biletim',
        'public',
        'bus_terminals',
        'GENERATED_COLUMN',
        'search_text',
        "to_tsvector('simple', name || ' ' || COALESCE(region, ''))",
      ],
    );
    await queryRunner.query(
      `CREATE TABLE "bus_terminals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "external_id" integer NOT NULL, "city_id" integer NOT NULL, "country_code" character varying NOT NULL, "region" character varying, "name" character varying NOT NULL, "description" character varying, "is_center" boolean NOT NULL DEFAULT false, "affiliated_center_id" integer NOT NULL, "appear_in_search" boolean NOT NULL DEFAULT true, "search_text" tsvector GENERATED ALWAYS AS (to_tsvector('simple', name || ' ' || COALESCE(region, ''))) STORED, CONSTRAINT "UQ_b10bf0c957adfe60f6acf5de998" UNIQUE ("external_id"), CONSTRAINT "PK_a04f16d2a622e510a3a4bba79d0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6670075b9c4da7213a49f372a3" ON "bus_terminals" ("appear_in_search") `,
    );
    await queryRunner.query(
      'CREATE INDEX "name_region_text_idx" ON "bus_terminals" USING GIN (search_text)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // bus terminals
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6670075b9c4da7213a49f372a3"`,
    );
    await queryRunner.query('DROP INDEX name_region_text_idx');
    await queryRunner.query(`DROP TABLE "bus_terminals"`);
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`,
      ['GENERATED_COLUMN', 'search_text', 'biletim', 'public', 'bus_terminals'],
    );

    // airports
    await queryRunner.query('DROP INDEX city_airport_text_idx');
    await queryRunner.query(`DROP TABLE "airports"`);
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`,
      ['GENERATED_COLUMN', 'search_text', 'biletim', 'public', 'airports'],
    );
  }
}
