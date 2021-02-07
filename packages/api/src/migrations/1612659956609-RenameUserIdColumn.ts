import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameUserIdColumn1612659956609 implements MigrationInterface {
  name = 'RenameUserIdColumn1612659956609';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "repository" DROP CONSTRAINT "FK_19cf11998e1776961d150dbdd43"`,
    );
    await queryRunner.query(
      `ALTER TABLE "repository" RENAME COLUMN "userId" TO "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "repository" ADD CONSTRAINT "FK_fa362fdb765619fa7b9fd8c2989" FOREIGN KEY ("user_id") REFERENCES "user_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "repository" DROP CONSTRAINT "FK_fa362fdb765619fa7b9fd8c2989"`,
    );
    await queryRunner.query(
      `ALTER TABLE "repository" RENAME COLUMN "user_id" TO "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "repository" ADD CONSTRAINT "FK_19cf11998e1776961d150dbdd43" FOREIGN KEY ("userId") REFERENCES "user_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
