import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrderInvoiceAndFlighFareOptions1732469460571
  implements MigrationInterface
{
  name = 'OrderInvoiceAndFlighFareOptions1732469460571';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "invoices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "pnr" character varying, "recipient_name" character varying NOT NULL, "identifier" character varying NOT NULL, "address" character varying NOT NULL, "tax_office" character varying, "phone_number" character varying NOT NULL, "email" character varying NOT NULL, CONSTRAINT "PK_668cef7c22a427fd822cc1be3ce" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_ticket_segments" DROP COLUMN "flight_class"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_ticket_segments" ADD "flight_class_code" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_ticket_segments" ADD "flight_fare_details" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD "ticket_price" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD "currency" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "orders" ADD "invoice_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "UQ_37c4b48e442041eceda6aeb478c" UNIQUE ("invoice_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_37c4b48e442041eceda6aeb478c" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_37c4b48e442041eceda6aeb478c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "UQ_37c4b48e442041eceda6aeb478c"`,
    );
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "invoice_id"`);
    await queryRunner.query(`ALTER TABLE "bus_tickets" DROP COLUMN "currency"`);
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" DROP COLUMN "ticket_price"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_ticket_segments" DROP COLUMN "flight_fare_details"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_ticket_segments" DROP COLUMN "flight_class_code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_ticket_segments" ADD "flight_class" character varying NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "invoices"`);
  }
}
