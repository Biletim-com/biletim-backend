import { MigrationInterface, QueryRunner } from 'typeorm';

export class BusTicketPassenger1732044269926 implements MigrationInterface {
  name = 'BusTicketPassenger1732044269926';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bus_ticket_passenger" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "gender" character varying NOT NULL, "tc_number" character varying(11), "passport_country_code" character varying, "passport_number" character varying, "passport_expiration_date" date, CONSTRAINT "PK_9af4f786f61da8d3a6e6980b91b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_ticket_segments" DROP COLUMN "flight_no"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_ticket_segments" DROP COLUMN "company_no"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" DROP COLUMN "passport_expiration_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" DROP COLUMN "passport_number"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" DROP COLUMN "passport_country_code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" DROP COLUMN "tc_number"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" DROP COLUMN "is_turkish_citizen"`,
    );
    await queryRunner.query(`ALTER TABLE "bus_tickets" DROP COLUMN "gender"`);
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" DROP COLUMN "last_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" DROP COLUMN "first_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" DROP COLUMN "company_no"`,
    );
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "last_name"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "first_name"`);
    await queryRunner.query(
      `ALTER TABLE "plane_ticket_segments" ADD "company_number" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_ticket_segments" ADD "flight_number" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD "company_number" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD "passenger_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD CONSTRAINT "UQ_298f98457c8d3db748ddc6049df" UNIQUE ("passenger_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD CONSTRAINT "FK_298f98457c8d3db748ddc6049df" FOREIGN KEY ("passenger_id") REFERENCES "bus_ticket_passenger"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" DROP CONSTRAINT "FK_298f98457c8d3db748ddc6049df"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" DROP CONSTRAINT "UQ_298f98457c8d3db748ddc6049df"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" DROP COLUMN "passenger_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" DROP COLUMN "company_number"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_ticket_segments" DROP COLUMN "flight_number"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_ticket_segments" DROP COLUMN "company_number"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "first_name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "last_name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD "company_no" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD "first_name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD "last_name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD "gender" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD "is_turkish_citizen" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD "tc_number" character varying(11)`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD "passport_country_code" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD "passport_number" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD "passport_expiration_date" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_ticket_segments" ADD "company_no" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_ticket_segments" ADD "flight_no" character varying NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "bus_ticket_passenger"`);
  }
}
