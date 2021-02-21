import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCommitAuthor1613930518517 implements MigrationInterface {
  name = 'CreateCommitAuthor1613930518517';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "commit_author" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resource" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "repository_member_id" uuid, CONSTRAINT "PK_96ca08cdea1175b926864e67c3c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "commit_author" ADD CONSTRAINT "FK_37a08efa127f1ed612125071e5e" FOREIGN KEY ("repository_member_id") REFERENCES "repository_member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "commit_author" DROP CONSTRAINT "FK_37a08efa127f1ed612125071e5e"`,
    );
    await queryRunner.query(`DROP TABLE "commit_author"`);
  }
}
