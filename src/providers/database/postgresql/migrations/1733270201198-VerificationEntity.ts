import { MigrationInterface, QueryRunner } from "typeorm";

export class VerificationEntity1733270201198 implements MigrationInterface {
    name = 'VerificationEntity1733270201198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plane_ticket_segments" DROP COLUMN "departure_airport"`);
        await queryRunner.query(`ALTER TABLE "plane_ticket_segments" DROP COLUMN "arrival_airport"`);
        await queryRunner.query(`ALTER TABLE "plane_ticket_segments" DROP COLUMN "departure_date"`);
        await queryRunner.query(`ALTER TABLE "plane_ticket_segments" DROP COLUMN "arrival_date"`);
        await queryRunner.query(`ALTER TABLE "verifications" DROP COLUMN "is_expired"`);
        await queryRunner.query(`ALTER TABLE "plane_ticket_segments" ADD "departure_date_time" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plane_ticket_segments" ADD "arrival_date_time" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plane_ticket_segments" ADD "airline_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plane_ticket_segments" ADD "departure_airport_code" character varying`);
        await queryRunner.query(`ALTER TABLE "plane_ticket_segments" ADD "arrival_airport_code" character varying`);
        await queryRunner.query(`ALTER TABLE "verifications" ADD "expired_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "verifications" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "verifications" ADD "order_id" uuid`);
        await queryRunner.query(`ALTER TABLE "verifications" DROP CONSTRAINT "FK_e9a134af366776c651168916616"`);
        await queryRunner.query(`ALTER TABLE "verifications" DROP CONSTRAINT "REL_e6a542673f9abc1f67e5f32aba"`);
        await queryRunner.query(`ALTER TABLE "plane_ticket_segments" ADD CONSTRAINT "FK_fcfbadc5b8821f095645344baa5" FOREIGN KEY ("departure_airport_code") REFERENCES "airports"("airport_code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plane_ticket_segments" ADD CONSTRAINT "FK_4edb5e991f39d6f8bd70736d43a" FOREIGN KEY ("arrival_airport_code") REFERENCES "airports"("airport_code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "verifications" ADD CONSTRAINT "FK_e9a134af366776c651168916616" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "verifications" ADD CONSTRAINT "FK_b2e645a2fbdaab9d955977c4505" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verifications" DROP CONSTRAINT "FK_b2e645a2fbdaab9d955977c4505"`);
        await queryRunner.query(`ALTER TABLE "verifications" DROP CONSTRAINT "FK_e9a134af366776c651168916616"`);
        await queryRunner.query(`ALTER TABLE "plane_ticket_segments" DROP CONSTRAINT "FK_4edb5e991f39d6f8bd70736d43a"`);
        await queryRunner.query(`ALTER TABLE "plane_ticket_segments" DROP CONSTRAINT "FK_fcfbadc5b8821f095645344baa5"`);
        await queryRunner.query(`ALTER TABLE "verifications" ADD CONSTRAINT "REL_e6a542673f9abc1f67e5f32aba" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "verifications" ADD CONSTRAINT "FK_e9a134af366776c651168916616" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "verifications" DROP COLUMN "order_id"`);
        await queryRunner.query(`ALTER TABLE "verifications" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "verifications" DROP COLUMN "expired_at"`);
        await queryRunner.query(`ALTER TABLE "plane_ticket_segments" DROP COLUMN "arrival_airport_code"`);
        await queryRunner.query(`ALTER TABLE "plane_ticket_segments" DROP COLUMN "departure_airport_code"`);
        await queryRunner.query(`ALTER TABLE "plane_ticket_segments" DROP COLUMN "airline_name"`);
        await queryRunner.query(`ALTER TABLE "plane_ticket_segments" DROP COLUMN "arrival_date_time"`);
        await queryRunner.query(`ALTER TABLE "plane_ticket_segments" DROP COLUMN "departure_date_time"`);
        await queryRunner.query(`ALTER TABLE "verifications" ADD "is_expired" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "plane_ticket_segments" ADD "arrival_date" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plane_ticket_segments" ADD "departure_date" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plane_ticket_segments" ADD "arrival_airport" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plane_ticket_segments" ADD "departure_airport" character varying NOT NULL`);
    }

}
