import { MigrationInterface, QueryRunner } from 'typeorm';

export class WalletRechargeOrder1735410965456 implements MigrationInterface {
  name = 'WalletRechargeOrder1735410965456';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wallet_recharge_orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_email" character varying NOT NULL, "user_phone_number" character varying NOT NULL, "status" character varying NOT NULL, "category" character varying NOT NULL, "type" character varying NOT NULL, "user_id" uuid, "transaction_id" uuid, "wallet_id" uuid, CONSTRAINT "REL_1ce97fded5d019968555916ddc" UNIQUE ("transaction_id"), CONSTRAINT "PK_4a99f58d32f9aa0af3270ef4f77" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_recharge_orders" ADD CONSTRAINT "FK_600709e5ad184befebd0693bca7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_recharge_orders" ADD CONSTRAINT "FK_1ce97fded5d019968555916ddcc" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "wallet_recharge_orders" DROP CONSTRAINT "FK_1ce97fded5d019968555916ddcc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_recharge_orders" DROP CONSTRAINT "FK_600709e5ad184befebd0693bca7"`,
    );
    await queryRunner.query(`DROP TABLE "wallet_recharge_orders"`);
  }
}
