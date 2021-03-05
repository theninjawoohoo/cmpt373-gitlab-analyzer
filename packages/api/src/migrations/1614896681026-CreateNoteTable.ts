import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNoteTable1614896681026 implements MigrationInterface {
  name = 'CreateNoteTable1614896681026';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "repository_id_fkey"`,
    );
    await queryRunner.query(
      `CREATE TABLE "issue" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resource" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f80e086c249b9f3f3ff2fd321b7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "notes" ADD "mergeRequestId" uuid`);
    await queryRunner.query(`ALTER TABLE "notes" ADD "issueId" uuid`);
    await queryRunner.query(`COMMENT ON COLUMN "notes"."id" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "notes"."created_at" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "notes" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "notes"."updated_at" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "notes" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_f63f3c58137b34ecde51250f878" FOREIGN KEY ("repository_id") REFERENCES "repository"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_46f3ede3a348b46f9b7b0c5a181" FOREIGN KEY ("mergeRequestId") REFERENCES "merge_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_76319c063668238ae0111390469" FOREIGN KEY ("issueId") REFERENCES "issue"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_76319c063668238ae0111390469"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_46f3ede3a348b46f9b7b0c5a181"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_f63f3c58137b34ecde51250f878"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ALTER COLUMN "updated_at" DROP DEFAULT`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "notes"."updated_at" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "notes" ALTER COLUMN "created_at" DROP DEFAULT`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "notes"."created_at" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "notes"."id" IS NULL`);
    await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "issueId"`);
    await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "mergeRequestId"`);
    await queryRunner.query(`DROP TABLE "issue"`);
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "repository_id_fkey" FOREIGN KEY ("repository_id") REFERENCES "repository"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
