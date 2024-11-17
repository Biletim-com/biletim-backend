import { MigrationInterface, QueryRunner } from 'typeorm';

export class PlaneTickets1731868127571 implements MigrationInterface {
  name = 'PlaneTickets1731868127571';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "plane_ticket_passenger" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "gender" character varying NOT NULL, "passenger_type" character varying NOT NULL, "birthday" date NOT NULL, "tc_number" character varying(11), "passport_country_code" character varying, "passport_number" character varying, "passport_expiration_date" date, CONSTRAINT "PK_9252f7526f3487294862f28a010" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "plane_ticket_segments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "segment_order" integer NOT NULL, "company_no" character varying NOT NULL, "departure_airport" character varying NOT NULL, "arrival_airport" character varying NOT NULL, "departure_date" character varying NOT NULL, "arrival_date" character varying NOT NULL, "flight_no" character varying NOT NULL, "flight_code" character varying NOT NULL, "flight_class" character varying NOT NULL, "airline_code" character varying NOT NULL, "is_return_flight" boolean NOT NULL, CONSTRAINT "PK_eb7f5e4890c0b26020484034186" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "plane_tickets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "ticket_order" integer NOT NULL, "ticket_number" character varying, "net_price" character varying NOT NULL, "tax_amount" character varying NOT NULL, "service_fee" character varying NOT NULL, "biletim_fee" character varying NOT NULL, "passenger_id" uuid, "order_id" uuid, CONSTRAINT "REL_b20861f535f5cc336c2b2df6b9" UNIQUE ("passenger_id"), CONSTRAINT "PK_c8d276b70337cf652b040c4797e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "plane_tickets_segments_plane_ticket_segments" ("plane_tickets_id" uuid NOT NULL, "plane_ticket_segments_id" uuid NOT NULL, CONSTRAINT "PK_dfd0c08aac63bfce25f82a5a70c" PRIMARY KEY ("plane_tickets_id", "plane_ticket_segments_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_96cb245d0dc92a229e9bf7ce9d" ON "plane_tickets_segments_plane_ticket_segments" ("plane_tickets_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_075a05cd489533c8e15c6cf5d9" ON "plane_tickets_segments_plane_ticket_segments" ("plane_ticket_segments_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_tickets" ADD CONSTRAINT "FK_b20861f535f5cc336c2b2df6b94" FOREIGN KEY ("passenger_id") REFERENCES "plane_ticket_passenger"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_tickets" ADD CONSTRAINT "FK_433291b12b434603679a4a4cdc0" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_tickets_segments_plane_ticket_segments" ADD CONSTRAINT "FK_96cb245d0dc92a229e9bf7ce9d2" FOREIGN KEY ("plane_tickets_id") REFERENCES "plane_tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_tickets_segments_plane_ticket_segments" ADD CONSTRAINT "FK_075a05cd489533c8e15c6cf5d92" FOREIGN KEY ("plane_ticket_segments_id") REFERENCES "plane_ticket_segments"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "plane_tickets_segments_plane_ticket_segments" DROP CONSTRAINT "FK_075a05cd489533c8e15c6cf5d92"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_tickets_segments_plane_ticket_segments" DROP CONSTRAINT "FK_96cb245d0dc92a229e9bf7ce9d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_tickets" DROP CONSTRAINT "FK_433291b12b434603679a4a4cdc0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_tickets" DROP CONSTRAINT "FK_b20861f535f5cc336c2b2df6b94"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_075a05cd489533c8e15c6cf5d9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_96cb245d0dc92a229e9bf7ce9d"`,
    );
    await queryRunner.query(
      `DROP TABLE "plane_tickets_segments_plane_ticket_segments"`,
    );
    await queryRunner.query(`DROP TABLE "plane_tickets"`);
    await queryRunner.query(`DROP TABLE "plane_ticket_segments"`);
    await queryRunner.query(`DROP TABLE "plane_ticket_passenger"`);
  }
}
