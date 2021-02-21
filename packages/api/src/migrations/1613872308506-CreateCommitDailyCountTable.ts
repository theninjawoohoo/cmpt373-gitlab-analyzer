import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCommitDailyCountTable1613872308506
  implements MigrationInterface {
  name = 'CreateCommitDailyCountTable1613872308506';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "commit_daily_count" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resource" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "repository_id" text NOT NULL, CONSTRAINT "PK_bf7c2218518bc233b4fadbffddd" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "commit_daily_count"`);
  }
}
