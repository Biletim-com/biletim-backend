import { MigrationInterface, QueryRunner } from 'typeorm';

export class WalletRechargeOrder1735409347948 implements MigrationInterface {
  name = 'WalletRechargeOrder1735409347948';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet_recharge_orders" DROP CONSTRAINT "FK_9b3fc5307a58c6eb99e04c7ff74"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_recharge_orders" DROP CONSTRAINT "REL_9b3fc5307a58c6eb99e04c7ff7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_recharge_orders" ADD CONSTRAINT "FK_9b3fc5307a58c6eb99e04c7ff74" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet_recharge_orders" DROP CONSTRAINT "FK_9b3fc5307a58c6eb99e04c7ff74"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_recharge_orders" ADD CONSTRAINT "REL_9b3fc5307a58c6eb99e04c7ff7" UNIQUE ("wallet_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_recharge_orders" ADD CONSTRAINT "FK_9b3fc5307a58c6eb99e04c7ff74" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
