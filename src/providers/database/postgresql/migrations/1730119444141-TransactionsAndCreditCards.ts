import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionsAndCreditCards1730119444141
  implements MigrationInterface
{
  name = 'TransactionsAndCreditCards1730119444141';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bus_tickets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_no" character varying NOT NULL, "seat_number" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "gender" character varying NOT NULL, "travel_start_date_time" TIMESTAMP NOT NULL, "tc_number" character varying(11), "passport_country_code" character varying, "passport_number" character varying, "passport_expiration_date" date NOT NULL, "departure_terminal_id" uuid, "arrival_terminal_id" uuid, "transaction_id" uuid, CONSTRAINT "PK_6bd2b6ef285a5ddc4f6b9120c49" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "passengers" DROP COLUMN "middle_name"`,
    );
    await queryRunner.query(`ALTER TABLE "passengers" DROP COLUMN "email"`);
    await queryRunner.query(`ALTER TABLE "passengers" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "middle_name"`);
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "payment_method" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "provider_reference_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "anonymous_email" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "cardholder_name" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "masked_pan" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "passports" DROP COLUMN "expiration_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "passports" ADD "expiration_date" date NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "passengers" DROP COLUMN "birthday"`);
    await queryRunner.query(`ALTER TABLE "passengers" ADD "birthday" date`);
    await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "amount"`);
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "amount" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD CONSTRAINT "FK_4be2d07e3559d0340fe934f24b5" FOREIGN KEY ("departure_terminal_id") REFERENCES "bus_terminals"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD CONSTRAINT "FK_cbd3a182332e8a79e4f7e5b5620" FOREIGN KEY ("arrival_terminal_id") REFERENCES "bus_terminals"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" ADD CONSTRAINT "FK_9b254702eb848367eed6b2dc8c6" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" DROP CONSTRAINT "FK_9b254702eb848367eed6b2dc8c6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" DROP CONSTRAINT "FK_cbd3a182332e8a79e4f7e5b5620"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bus_tickets" DROP CONSTRAINT "FK_4be2d07e3559d0340fe934f24b5"`,
    );
    await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "amount"`);
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "amount" integer NOT NULL`,
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
      `ALTER TABLE "transactions" DROP COLUMN "masked_pan"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP COLUMN "cardholder_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP COLUMN "anonymous_email"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP COLUMN "provider_reference_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP COLUMN "payment_method"`,
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
    await queryRunner.query(`DROP TABLE "bus_tickets"`);
  }
}
