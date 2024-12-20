import { MigrationInterface, QueryRunner } from 'typeorm';

export class BusTicketOrderAndPlaneTicketOrder1734655021969
  implements MigrationInterface
{
  name = 'BusTicketOrderAndPlaneTicketOrder1734655021969';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "plane_tickets" DROP CONSTRAINT "FK_433291b12b434603679a4a4cdc0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_tickets" DROP CONSTRAINT "FK_b20861f535f5cc336c2b2df6b94"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" DROP CONSTRAINT "FK_61d3d48a248ee7d50ee85326a0d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" DROP CONSTRAINT "FK_cbd3a182332e8a79e4f7e5b5620"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" DROP CONSTRAINT "FK_4be2d07e3559d0340fe934f24b5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" DROP CONSTRAINT "FK_b2e645a2fbdaab9d955977c4505"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hotel_booking_orders" RENAME COLUMN "type" TO "category"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hotel_booking_orders" ADD "type" character varying NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "plane_ticket_passengers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "gender" character varying NOT NULL, "passenger_type" character varying NOT NULL, "birthday" date NOT NULL, "tc_number" character varying(11), "passport_country_code" character varying, "passport_number" character varying, "passport_expiration_date" date, CONSTRAINT "PK_e9155f9b58c44e5dc67e11f58fd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "plane_ticket_orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_email" character varying NOT NULL, "user_phone_number" character varying NOT NULL, "status" character varying NOT NULL, "category" character varying NOT NULL, "pnr" character varying, "user_id" uuid, "invoice_id" uuid, "transaction_id" uuid, CONSTRAINT "REL_e82439f29ba75b8cb6e4044446" UNIQUE ("invoice_id"), CONSTRAINT "REL_fd6560df6b8537145e8205fa2c" UNIQUE ("transaction_id"), CONSTRAINT "PK_5fb67c7ee91f8a48f2ea38db78e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_ticket_orders" ADD "type" character varying NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "bus_ticket_orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_email" character varying NOT NULL, "user_phone_number" character varying NOT NULL, "status" character varying NOT NULL, "category" character varying NOT NULL, "pnr" character varying, "trip_tracking_number" character varying NOT NULL, "company_number" character varying NOT NULL, "company_name" character varying NOT NULL, "route_number" character varying NOT NULL, "travel_start_date_time" character varying NOT NULL, "user_id" uuid, "departure_terminal_id" uuid, "arrival_terminal_id" uuid, "invoice_id" uuid, "transaction_id" uuid, CONSTRAINT "REL_c0f2cb046364325e2de5b1affa" UNIQUE ("invoice_id"), CONSTRAINT "REL_c4436b6c254bcf60ea1fe47685" UNIQUE ("transaction_id"), CONSTRAINT "PK_ad4064486464c53c66aa28bab95" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" DROP COLUMN "company_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" DROP COLUMN "route_number"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" DROP COLUMN "trip_tracking_number"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" DROP COLUMN "travel_start_date_time"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" DROP COLUMN "departure_terminal_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" DROP COLUMN "arrival_terminal_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" DROP COLUMN "company_number"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" DROP COLUMN "order_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_ticket_segments" ADD "order_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" ADD "bus_ticket_order_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" ADD "plane_ticket_order_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" ADD "hotel_booking_order_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_tickets" ADD CONSTRAINT "FK_b20861f535f5cc336c2b2df6b94" FOREIGN KEY ("passenger_id") REFERENCES "plane_ticket_passengers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_tickets" ADD CONSTRAINT "FK_433291b12b434603679a4a4cdc0" FOREIGN KEY ("order_id") REFERENCES "plane_ticket_orders"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_ticket_segments" ADD CONSTRAINT "FK_d41f1b1f1c699be5edd28a8b98a" FOREIGN KEY ("order_id") REFERENCES "plane_ticket_orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_ticket_orders" ADD CONSTRAINT "FK_33defa5fb1a57769308928d7dc0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_ticket_orders" ADD CONSTRAINT "FK_e82439f29ba75b8cb6e4044446e" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_ticket_orders" ADD CONSTRAINT "FK_fd6560df6b8537145e8205fa2cc" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD CONSTRAINT "FK_61d3d48a248ee7d50ee85326a0d" FOREIGN KEY ("order_id") REFERENCES "bus_ticket_orders"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_ticket_orders" ADD CONSTRAINT "FK_eefcc9d5f7b0da0feb7603e5be3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_ticket_orders" ADD CONSTRAINT "FK_de2c971b831e1be89fbdc528f05" FOREIGN KEY ("departure_terminal_id") REFERENCES "bus_terminals"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_ticket_orders" ADD CONSTRAINT "FK_b210b99311b84f9bd2115b8c280" FOREIGN KEY ("arrival_terminal_id") REFERENCES "bus_terminals"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_ticket_orders" ADD CONSTRAINT "FK_c0f2cb046364325e2de5b1affa8" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_ticket_orders" ADD CONSTRAINT "FK_c4436b6c254bcf60ea1fe476851" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_ticket_orders" ADD "type" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" ADD CONSTRAINT "FK_117042f876ee11409417eb9ee4b" FOREIGN KEY ("bus_ticket_order_id") REFERENCES "bus_ticket_orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" ADD CONSTRAINT "FK_3efcab319bd547372232787e9c3" FOREIGN KEY ("plane_ticket_order_id") REFERENCES "plane_ticket_orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" ADD CONSTRAINT "FK_0bb6b12fe3d0b70b4900ce7467a" FOREIGN KEY ("hotel_booking_order_id") REFERENCES "hotel_booking_orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(
      `DROP TABLE "plane_tickets_segments_plane_ticket_segments"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "verifications" DROP CONSTRAINT "FK_0bb6b12fe3d0b70b4900ce7467a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" DROP CONSTRAINT "FK_3efcab319bd547372232787e9c3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" DROP CONSTRAINT "FK_117042f876ee11409417eb9ee4b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_ticket_orders" DROP CONSTRAINT "FK_c4436b6c254bcf60ea1fe476851"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_ticket_orders" DROP CONSTRAINT "FK_c0f2cb046364325e2de5b1affa8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_ticket_orders" DROP CONSTRAINT "FK_b210b99311b84f9bd2115b8c280"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_ticket_orders" DROP CONSTRAINT "FK_de2c971b831e1be89fbdc528f05"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_ticket_orders" DROP CONSTRAINT "FK_eefcc9d5f7b0da0feb7603e5be3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" DROP CONSTRAINT "FK_61d3d48a248ee7d50ee85326a0d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_ticket_orders" DROP CONSTRAINT "FK_fd6560df6b8537145e8205fa2cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_ticket_orders" DROP CONSTRAINT "FK_e82439f29ba75b8cb6e4044446e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_ticket_orders" DROP CONSTRAINT "FK_33defa5fb1a57769308928d7dc0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_ticket_segments" DROP CONSTRAINT "FK_d41f1b1f1c699be5edd28a8b98a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_tickets" DROP CONSTRAINT "FK_433291b12b434603679a4a4cdc0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_tickets" DROP CONSTRAINT "FK_b20861f535f5cc336c2b2df6b94"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" DROP COLUMN "hotel_booking_order_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" DROP COLUMN "plane_ticket_order_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" DROP COLUMN "bus_ticket_order_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_ticket_segments" DROP COLUMN "order_id"`,
    );
    await queryRunner.query(`ALTER TABLE "verifications" ADD "order_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD "company_number" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD "arrival_terminal_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD "departure_terminal_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD "travel_start_date_time" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD "trip_tracking_number" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD "route_number" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD "company_name" character varying NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "bus_ticket_orders"`);
    await queryRunner.query(`DROP TABLE "plane_ticket_orders"`);
    await queryRunner.query(`DROP TABLE "plane_ticket_passengers"`);
    await queryRunner.query(
      `ALTER TABLE "hotel_booking_orders" RENAME COLUMN "category" TO "type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" ADD CONSTRAINT "FK_b2e645a2fbdaab9d955977c4505" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD CONSTRAINT "FK_4be2d07e3559d0340fe934f24b5" FOREIGN KEY ("departure_terminal_id") REFERENCES "bus_terminals"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD CONSTRAINT "FK_cbd3a182332e8a79e4f7e5b5620" FOREIGN KEY ("arrival_terminal_id") REFERENCES "bus_terminals"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD CONSTRAINT "FK_61d3d48a248ee7d50ee85326a0d" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_tickets" ADD CONSTRAINT "FK_b20861f535f5cc336c2b2df6b94" FOREIGN KEY ("passenger_id") REFERENCES "plane_ticket_passenger"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_tickets" ADD CONSTRAINT "FK_433291b12b434603679a4a4cdc0" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_ticket_orders" DROP COLUMN "type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hotel_booking_orders" DROP COLUMN "type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plane_ticket_orders" DROP COLUMN "type"`,
    );
  }
}
