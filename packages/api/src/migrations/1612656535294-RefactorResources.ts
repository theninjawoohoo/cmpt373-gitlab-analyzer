import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorResources1612656535294 implements MigrationInterface {
  name = 'RefactorResources1612656535294';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "repository" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resource" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_b842c26651c6fc0b9ccd1c530e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "repository" ADD CONSTRAINT "FK_19cf11998e1776961d150dbdd43" FOREIGN KEY ("userId") REFERENCES "user_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "repository" DROP CONSTRAINT "FK_19cf11998e1776961d150dbdd43"`,
    );
    await queryRunner.query(`DROP TABLE "repository"`);
  }
}
