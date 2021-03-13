import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIssueTable1615663491266 implements MigrationInterface {
  name = 'CreateIssueTable1615663491266';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "issue" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resource" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "repository_id" uuid, CONSTRAINT "PK_f80e086c249b9f3f3ff2fd321b7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "issue" ADD CONSTRAINT "FK_d4e078226c68d8f626200ee28ed" FOREIGN KEY ("repository_id") REFERENCES "repository"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "issue" DROP CONSTRAINT "FK_d4e078226c68d8f626200ee28ed"`,
    );
    await queryRunner.query(`DROP TABLE "issue"`);
  }
}
