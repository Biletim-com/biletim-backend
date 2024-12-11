import { MigrationInterface, QueryRunner } from 'typeorm';

export class OnDeleteUserCascadeBankCards1733951356077
  implements MigrationInterface
{
  name = 'OnDeleteUserCascadeBankCards1733951356077';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bank_cards" DROP CONSTRAINT "FK_0859655a741507c10976af1c09c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_cards" ADD CONSTRAINT "FK_0859655a741507c10976af1c09c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bank_cards" DROP CONSTRAINT "FK_0859655a741507c10976af1c09c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_cards" ADD CONSTRAINT "FK_0859655a741507c10976af1c09c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
