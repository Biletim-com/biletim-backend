import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionsBusTicketsBankCards1731349639857
  implements MigrationInterface
{
  name = 'TransactionsBusTicketsBankCards1731349639857';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bank_cards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "hash" character varying NOT NULL, "masked_pan" character varying NOT NULL, "vakif_pan_token" character varying NOT NULL, "garanti_pan_token" character varying NOT NULL, "ratehawk_pan_token" character varying NOT NULL, "expiry_date" date NOT NULL, "holder_name" character varying NOT NULL, "user_id" uuid, CONSTRAINT "PK_1fce641a809c455751dbebc8d01" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "wallets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "balance" integer NOT NULL DEFAULT '0', "user_id" uuid, CONSTRAINT "REL_92558c08091598f7a4439586cd" UNIQUE ("user_id"), CONSTRAINT "PK_8402e5df5a30a229380e83e4f7e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bus_tickets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_no" character varying NOT NULL, "company_name" character varying NOT NULL, "ticket_number" character varying, "ticket_order" integer NOT NULL, "route_number" character varying NOT NULL, "trip_tracking_number" character varying NOT NULL, "seat_number" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "gender" character varying NOT NULL, "travel_start_date_time" character varying NOT NULL, "is_turkish_citizen" boolean NOT NULL, "tc_number" character varying(11), "passport_country_code" character varying, "passport_number" character varying, "passport_expiration_date" date, "departure_terminal_id" uuid, "arrival_terminal_id" uuid, "order_id" uuid, CONSTRAINT "PK_6bd2b6ef285a5ddc4f6b9120c49" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "user_email" character varying NOT NULL, "user_phone_number" character varying NOT NULL, "status" character varying NOT NULL, "type" character varying NOT NULL, "pnr" character varying, "user_id" uuid, "transaction_id" uuid, CONSTRAINT "REL_4547f22852bd9778b54dafe30e" UNIQUE ("transaction_id"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "amount" numeric NOT NULL, "currency" character varying NOT NULL, "status" character varying NOT NULL, "transaction_type" character varying NOT NULL, "payment_method" character varying NOT NULL, "payment_provider" character varying, "error_message" character varying, "cardholder_name" character varying, "masked_pan" character varying, "bank_card_id" uuid, "wallet_id" uuid, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "passengers" DROP COLUMN "middle_name"`,
    );
    await queryRunner.query(`ALTER TABLE "passengers" DROP COLUMN "email"`);
    await queryRunner.query(`ALTER TABLE "passengers" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "middle_name"`);
    await queryRunner.query(
      `ALTER TABLE "passports" DROP COLUMN "expiration_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "passports" ADD "expiration_date" date NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "passengers" DROP COLUMN "birthday"`);
    await queryRunner.query(`ALTER TABLE "passengers" ADD "birthday" date`);
    await queryRunner.query(
      `ALTER TABLE "bank_cards" ADD CONSTRAINT "FK_0859655a741507c10976af1c09c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD CONSTRAINT "FK_92558c08091598f7a4439586cda" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_4547f22852bd9778b54dafe30e5" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_f2270bbc11d52b77cad5469f534" FOREIGN KEY ("bank_card_id") REFERENCES "bank_cards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_0b171330be0cb621f8d73b87a9e" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_0b171330be0cb621f8d73b87a9e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_f2270bbc11d52b77cad5469f534"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_4547f22852bd9778b54dafe30e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`,
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
      `ALTER TABLE "wallets" DROP CONSTRAINT "FK_92558c08091598f7a4439586cda"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_cards" DROP CONSTRAINT "FK_0859655a741507c10976af1c09c"`,
    );
    await queryRunner.query(`ALTER TABLE "passengers" DROP COLUMN "birthday"`);
    await queryRunner.query(
      `ALTER TABLE "passengers" ADD "birthday" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "passports" DROP COLUMN "expiration_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "passports" ADD "expiration_date" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "middle_name" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "passengers" ADD "phone" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "passengers" ADD "email" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "passengers" ADD "middle_name" character varying`,
    );
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TABLE "bus_tickets"`);
    await queryRunner.query(`DROP TABLE "wallets"`);
    await queryRunner.query(`DROP TABLE "bank_cards"`);
  }
}
