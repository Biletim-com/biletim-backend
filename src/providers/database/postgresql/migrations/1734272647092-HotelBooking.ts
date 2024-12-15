import { MigrationInterface, QueryRunner } from 'typeorm';

export class HotelBooking1734272647092 implements MigrationInterface {
  name = 'HotelBooking1734272647092';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "hotel_booking_orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_email" character varying NOT NULL, "user_phone_number" character varying NOT NULL, "status" character varying NOT NULL, "type" character varying NOT NULL, "upsell" jsonb NOT NULL, "payment_type" jsonb NOT NULL, "user_id" uuid, "transaction_id" uuid, "invoice_id" uuid, CONSTRAINT "REL_7892a596e38516f69906f98ae2" UNIQUE ("transaction_id"), CONSTRAINT "REL_2e0fb39c9fb7e54b510d0210e7" UNIQUE ("invoice_id"), CONSTRAINT "PK_17d3f1fd4fc367e2a8963c8a1b3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "hotel_booking_rooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "order_id" uuid, CONSTRAINT "PK_13e6caab29656e8bbf14ca2153c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "hotel_booking_room_guests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "gender" character varying NOT NULL, "birthday" date NOT NULL, "room_id" uuid, CONSTRAINT "PK_46a9f2e90ec531d307ccff6ec29" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "hotel_booking_orders" ADD CONSTRAINT "FK_3b7fcccd2e3184f1400cf92b26a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hotel_booking_orders" ADD CONSTRAINT "FK_7892a596e38516f69906f98ae2b" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hotel_booking_orders" ADD CONSTRAINT "FK_2e0fb39c9fb7e54b510d0210e7a" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hotel_booking_rooms" ADD CONSTRAINT "FK_87e5772a9f2fabcbec5bf37b5e5" FOREIGN KEY ("order_id") REFERENCES "hotel_booking_orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hotel_booking_room_guests" ADD CONSTRAINT "FK_4e5901d9aa41659c50f1e15815c" FOREIGN KEY ("room_id") REFERENCES "hotel_booking_rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hotel_booking_room_guests" DROP CONSTRAINT "FK_4e5901d9aa41659c50f1e15815c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hotel_booking_rooms" DROP CONSTRAINT "FK_87e5772a9f2fabcbec5bf37b5e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hotel_booking_orders" DROP CONSTRAINT "FK_2e0fb39c9fb7e54b510d0210e7a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hotel_booking_orders" DROP CONSTRAINT "FK_7892a596e38516f69906f98ae2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hotel_booking_orders" DROP CONSTRAINT "FK_3b7fcccd2e3184f1400cf92b26a"`,
    );
    await queryRunner.query(`DROP TABLE "hotel_booking_room_guests"`);
    await queryRunner.query(`DROP TABLE "hotel_booking_rooms"`);
    await queryRunner.query(`DROP TABLE "hotel_booking_orders"`);
  }
}
