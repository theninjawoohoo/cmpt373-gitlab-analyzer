import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGitlabTokenTable1612041476932 implements MigrationInterface {
  name = 'CreateGitlabTokenTable1612041476932';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "gitlab_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "expired" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_4fe079e3dd381741007653ec18e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "gitlab_token" ADD "user_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "gitlab_token" ADD CONSTRAINT "UQ_960460c5e069493892bedcee6e1" UNIQUE ("user_id")`,
    );
    await queryRunner.query(`ALTER TABLE "gitlab_token" DROP COLUMN "token"`);
    await queryRunner.query(
      `ALTER TABLE "gitlab_token" ADD "token" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "gitlab_token" ADD CONSTRAINT "FK_960460c5e069493892bedcee6e1" FOREIGN KEY ("user_id") REFERENCES "user_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gitlab_token" DROP CONSTRAINT "FK_960460c5e069493892bedcee6e1"`,
    );
    await queryRunner.query(`ALTER TABLE "gitlab_token" DROP COLUMN "token"`);
    await queryRunner.query(
      `ALTER TABLE "gitlab_token" ADD "token" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "gitlab_token" DROP CONSTRAINT "UQ_960460c5e069493892bedcee6e1"`,
    );
    await queryRunner.query(`ALTER TABLE "gitlab_token" DROP COLUMN "user_id"`);
    await queryRunner.query(`DROP TABLE "gitlab_token"`);
  }
}
