import { MigrationInterface, QueryRunner } from 'typeorm';

export class InvoiceAddress1736167154708 implements MigrationInterface {
  name = 'InvoiceAddress1736167154708';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "invoice_addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "name" character varying NOT NULL, "identifier" character varying NOT NULL, "address" character varying NOT NULL, "tax_office" character varying, "user_id" uuid, CONSTRAINT "PK_db5bdacab5f684daf34e7b2a7ef" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_addresses" ADD CONSTRAINT "FK_9b6f9cddd992d910eddd368f09b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice_addresses" DROP CONSTRAINT "FK_9b6f9cddd992d910eddd368f09b"`,
    );
    await queryRunner.query(`DROP TABLE "invoice_addresses"`);
  }
}
