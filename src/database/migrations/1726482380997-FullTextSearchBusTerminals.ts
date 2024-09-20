import { MigrationInterface, QueryRunner } from 'typeorm';

export class FullTextSearchBusTerminals1726482380997
  implements MigrationInterface
{
  name = 'FullTextSearchBusTerminals1726482380997';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9a55f5aa74f6cb3d13651245c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_terminals" ADD "name_text" tsvector GENERATED ALWAYS AS (to_tsvector('simple', name)) STORED`,
    );
    await queryRunner.query(
      'CREATE INDEX name_text_idx ON bus_terminals USING GIN (name_text)',
    );
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        'biletim',
        'public',
        'bus_terminals',
        'GENERATED_COLUMN',
        'name_text',
        "to_tsvector('simple', name)",
      ],
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6670075b9c4da7213a49f372a3" ON "bus_terminals" ("appear_in_search") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6670075b9c4da7213a49f372a3"`,
    );
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`,
      ['GENERATED_COLUMN', 'name_text', 'biletim', 'public', 'bus_terminals'],
    );
    await queryRunner.query('DROP INDEX name_text_idx');
    await queryRunner.query(
      `ALTER TABLE "bus_terminals" DROP COLUMN "name_text"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9a55f5aa74f6cb3d13651245c5" ON "bus_terminals" ("appear_in_search") `,
    );
  }
}
