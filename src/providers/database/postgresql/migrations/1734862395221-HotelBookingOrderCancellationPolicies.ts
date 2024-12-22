import { MigrationInterface, QueryRunner } from 'typeorm';

export class HotelBookingOrderCancellationPolicies1734862395221
  implements MigrationInterface
{
  name = 'HotelBookingOrderCancellationPolicies1734862395221';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP COLUMN "payment_method"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "refund_source" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "hotel_booking_orders" ADD "checkin_date_time" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hotel_booking_orders" ADD "checkout_date_time" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hotel_booking_orders" ADD "cancellation_penalties" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ALTER COLUMN "payment_provider" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" ALTER COLUMN "payment_provider" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hotel_booking_orders" DROP COLUMN "cancellation_penalties"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hotel_booking_orders" DROP COLUMN "checkout_date_time"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hotel_booking_orders" DROP COLUMN "checkin_date_time"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP COLUMN "refund_source"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "payment_method" character varying NOT NULL`,
    );
  }
}
