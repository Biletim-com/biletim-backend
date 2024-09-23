import { MigrationInterface, QueryRunner } from 'typeorm';

export class Passengers1727109296580 implements MigrationInterface {
  name = 'Passengers1727109296580';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "verifications" DROP CONSTRAINT "FK_e9a134af366776c651168916616"`,
    );
    await queryRunner.query(
      `CREATE TABLE "passports" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "number" character varying NOT NULL, "country" character varying NOT NULL, "expiration_date" TIMESTAMP NOT NULL, CONSTRAINT "PK_815eb61bea28dbd88b1a6b9207b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "passengers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "middle_name" character varying, "family_name" character varying NOT NULL, "gender" character varying NOT NULL, "email" character varying, "phone" character varying, "birthday" TIMESTAMP, "tc_number" character varying(11) NOT NULL, "user_id" uuid, "passport_id" uuid, CONSTRAINT "REL_909ea240b1d0e6878630672e7e" UNIQUE ("passport_id"), CONSTRAINT "PK_9863c72acd866e4529f65c6c98c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" ADD CONSTRAINT "FK_e9a134af366776c651168916616" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "passengers" ADD CONSTRAINT "FK_aa4b8df12b1dbb9e57af44f7af8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "passengers" ADD CONSTRAINT "FK_909ea240b1d0e6878630672e7e6" FOREIGN KEY ("passport_id") REFERENCES "passports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "passengers" DROP CONSTRAINT "FK_909ea240b1d0e6878630672e7e6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "passengers" DROP CONSTRAINT "FK_aa4b8df12b1dbb9e57af44f7af8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" DROP CONSTRAINT "FK_e9a134af366776c651168916616"`,
    );
    await queryRunner.query(`DROP TABLE "passengers"`);
    await queryRunner.query(`DROP TABLE "passports"`);
    await queryRunner.query(
      `ALTER TABLE "verifications" ADD CONSTRAINT "FK_e9a134af366776c651168916616" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
