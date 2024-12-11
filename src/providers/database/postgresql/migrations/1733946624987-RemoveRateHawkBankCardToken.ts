import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveRateHawkBankCardToken1733946624987
  implements MigrationInterface
{
  name = 'RemoveRateHawkBankCardToken1733946624987';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bank_cards" DROP COLUMN "ratehawk_pan_token"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bank_cards" ADD "ratehawk_pan_token" character varying NOT NULL`,
    );
  }
}
