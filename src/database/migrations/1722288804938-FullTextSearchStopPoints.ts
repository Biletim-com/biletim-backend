import { MigrationInterface, QueryRunner } from 'typeorm';

export class FullTextSearchStopPoints1722288804938
  implements MigrationInterface
{
  name?: 'FullTextSearchStopPoints1722288804938';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add tsvector column
    await queryRunner.query(
      "ALTER TABLE stop_points ADD COLUMN name_text tsvector \
           GENERATED ALWAYS AS (to_tsvector('simple', name)) STORED",
    );
    await queryRunner.query(
      'CREATE INDEX name_text_idx ON stop_points USING GIN (name_text)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX name_text_idx');
    await queryRunner.query('ALTER TABLE stop_points DROP COLUMN name_text');
  }
}
