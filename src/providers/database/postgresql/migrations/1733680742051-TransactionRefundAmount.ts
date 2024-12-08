import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionRefundAmount1733680742051
  implements MigrationInterface
{
  name = 'TransactionRefundAmount1733680742051';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "verifications" DROP COLUMN "is_expired"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "refund_amount" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP COLUMN "refund_amount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" ADD "is_expired" boolean NOT NULL DEFAULT false`,
    );
  }
}
