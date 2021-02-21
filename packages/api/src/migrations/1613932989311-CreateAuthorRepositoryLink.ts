import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuthorRepositoryLink1613932989311
  implements MigrationInterface {
  name = 'CreateAuthorRepositoryLink1613932989311';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "merge_request_participant" DROP CONSTRAINT "FK_4db45139cd7b20a9d31ba4e704a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "commit_author" ADD "repository_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "commit_author" ADD CONSTRAINT "FK_02f261d7e092b823f2d0b25ea87" FOREIGN KEY ("repository_id") REFERENCES "repository"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "merge_request_participant" ADD CONSTRAINT "FK_4788b6dc0350aab05a9b5255d16" FOREIGN KEY ("merge_request_id") REFERENCES "merge_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "merge_request_participant" DROP CONSTRAINT "FK_4788b6dc0350aab05a9b5255d16"`,
    );
    await queryRunner.query(
      `ALTER TABLE "commit_author" DROP CONSTRAINT "FK_02f261d7e092b823f2d0b25ea87"`,
    );
    await queryRunner.query(
      `ALTER TABLE "commit_author" DROP COLUMN "repository_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "merge_request_participant" ADD CONSTRAINT "FK_4db45139cd7b20a9d31ba4e704a" FOREIGN KEY ("merge_request_id") REFERENCES "merge_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
