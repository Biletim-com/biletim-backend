import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePanelUsersAndUsersTables1721598365026
  implements MigrationInterface
{
  name = 'CreatePanelUsersAndUsersTables1721598365026';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "verifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "verification_code" integer NOT NULL, "is_used" boolean NOT NULL DEFAULT false, "is_expired" boolean NOT NULL DEFAULT false, "userId" uuid, CONSTRAINT "REL_e6a542673f9abc1f67e5f32aba" UNIQUE ("userId"), CONSTRAINT "PK_2127ad1b143cf012280390b01d1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "family_name" integer NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone" character varying, "address" character varying, "is_deleted" boolean NOT NULL DEFAULT false, "is_verified" boolean NOT NULL DEFAULT false, "forgot_password_code" uuid, "is_used" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "panel_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "family_name" integer NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone" character varying, "address" character varying, "is_deleted" boolean NOT NULL DEFAULT false, "is_super_admin" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_29bbf136855c1d44fc75ecbac38" UNIQUE ("email"), CONSTRAINT "PK_780b42b83286dd56c7cd2ee433c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" ADD CONSTRAINT "FK_e6a542673f9abc1f67e5f32abaf" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "verifications" DROP CONSTRAINT "FK_e6a542673f9abc1f67e5f32abaf"`,
    );
    await queryRunner.query(`DROP TABLE "panel_users"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "verifications"`);
  }
}
