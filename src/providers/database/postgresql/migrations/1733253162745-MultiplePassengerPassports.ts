import { MigrationInterface, QueryRunner } from 'typeorm';

export class MultiplePassengerPassports1733253162745
  implements MigrationInterface
{
  name = 'MultiplePassengerPassports1733253162745';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "passengers" DROP CONSTRAINT "FK_909ea240b1d0e6878630672e7e6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "passengers" DROP CONSTRAINT "REL_909ea240b1d0e6878630672e7e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "passengers" DROP COLUMN "passport_id"`,
    );
    await queryRunner.query(`ALTER TABLE "passengers" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "passengers" DROP COLUMN "family_name"`,
    );
    await queryRunner.query(`ALTER TABLE "passports" ADD "passenger_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "passengers" ADD "first_name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "passengers" ADD "last_name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "passengers" ADD "email" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "passengers" ADD "phone_number" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "passengers" ALTER COLUMN "birthday" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "passports" ADD CONSTRAINT "FK_5e1d4dd0db0c7d4402bff85d054" FOREIGN KEY ("passenger_id") REFERENCES "passengers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "passports" DROP CONSTRAINT "FK_5e1d4dd0db0c7d4402bff85d054"`,
    );
    await queryRunner.query(
      `ALTER TABLE "passengers" ALTER COLUMN "birthday" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "passengers" DROP COLUMN "phone_number"`,
    );
    await queryRunner.query(`ALTER TABLE "passengers" DROP COLUMN "email"`);
    await queryRunner.query(`ALTER TABLE "passengers" DROP COLUMN "last_name"`);
    await queryRunner.query(
      `ALTER TABLE "passengers" DROP COLUMN "first_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "passports" DROP COLUMN "passenger_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "passengers" ADD "family_name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "passengers" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "passengers" ADD "passport_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "passengers" ADD CONSTRAINT "REL_909ea240b1d0e6878630672e7e" UNIQUE ("passport_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "passengers" ADD CONSTRAINT "FK_909ea240b1d0e6878630672e7e6" FOREIGN KEY ("passport_id") REFERENCES "passports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
