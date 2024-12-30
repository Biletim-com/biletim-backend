import { MigrationInterface, QueryRunner } from 'typeorm';

export class WalletBalanceDataTypeUpdate1735243688166
  implements MigrationInterface
{
  name = 'WalletBalanceDataTypeUpdate1735243688166';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "balance"`);
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD "balance" numeric NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD CONSTRAINT "CHK_1c1bf32c2aa1b0f104543f3d6a" CHECK ("balance" >= 0)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallets" DROP CONSTRAINT "CHK_1c1bf32c2aa1b0f104543f3d6a"`,
    );
    await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "balance"`);
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD "balance" integer NOT NULL DEFAULT '0'`,
    );
  }
}
