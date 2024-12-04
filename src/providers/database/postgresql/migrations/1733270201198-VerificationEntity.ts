import { MigrationInterface, QueryRunner } from 'typeorm';

export class VerificationEntity1733270201198 implements MigrationInterface {
  name = 'VerificationEntity1733270201198';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "verifications" ADD "expired_at" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" ADD "type" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "verifications" ADD "order_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "verifications" DROP CONSTRAINT "FK_e9a134af366776c651168916616"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" DROP CONSTRAINT "REL_e6a542673f9abc1f67e5f32aba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" ADD CONSTRAINT "FK_e9a134af366776c651168916616" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" ADD CONSTRAINT "FK_b2e645a2fbdaab9d955977c4505" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "verifications" DROP CONSTRAINT "FK_b2e645a2fbdaab9d955977c4505"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" DROP CONSTRAINT "FK_e9a134af366776c651168916616"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" ADD CONSTRAINT "REL_e6a542673f9abc1f67e5f32aba" UNIQUE ("user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" ADD CONSTRAINT "FK_e9a134af366776c651168916616" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" DROP COLUMN "order_id"`,
    );
    await queryRunner.query(`ALTER TABLE "verifications" DROP COLUMN "type"`);
    await queryRunner.query(
      `ALTER TABLE "verifications" DROP COLUMN "expired_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" ADD "is_expired" boolean NOT NULL DEFAULT false`,
    );
  }
}
