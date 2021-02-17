import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCommitTable1613360878072 implements MigrationInterface {
  name = 'CreateCommitTable1613360878072';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "commit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resource" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "repository_id" uuid, CONSTRAINT "PK_98f1c01f7e878fc55476f332c4e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "commit" ADD CONSTRAINT "FK_8046198d7115b252bb07066ffbb" FOREIGN KEY ("repository_id") REFERENCES "repository"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "commit" DROP CONSTRAINT "FK_8046198d7115b252bb07066ffbb"`,
    );
    await queryRunner.query(`DROP TABLE "commit"`);
  }
}
