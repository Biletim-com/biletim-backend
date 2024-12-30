import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInvoiceAddress1735387628198 implements MigrationInterface {
  name = 'AddInvoiceAddress1735387628198';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "invoice_addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "full_name" character varying, "identifier" character varying, "country" character varying, "city" character varying, "district" character varying, "address" character varying, "postal_code" character varying, "company_name" character varying, "is_personal_company" boolean DEFAULT false, "tax_office" character varying, "tax_number" character varying, "user_id" uuid, CONSTRAINT "PK_db5bdacab5f684daf34e7b2a7ef" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD CONSTRAINT "CHK_1c1bf32c2aa1b0f104543f3d6a" CHECK ("balance" >= 0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_addresses" ADD CONSTRAINT "FK_9b6f9cddd992d910eddd368f09b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice_addresses" DROP CONSTRAINT "FK_9b6f9cddd992d910eddd368f09b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" DROP CONSTRAINT "CHK_1c1bf32c2aa1b0f104543f3d6a"`,
    );
    await queryRunner.query(`DROP TABLE "invoice_addresses"`);
  }
}
