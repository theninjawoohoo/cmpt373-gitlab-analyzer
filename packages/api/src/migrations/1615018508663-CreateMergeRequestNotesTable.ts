import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMergeRequestNotesTable1615018508663
  implements MigrationInterface {
  name = 'CreateMergeRequestNotesTable1615018508663';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "merge_request_note" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resource" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "merge_request_id" uuid, CONSTRAINT "PK_6602488f85e1fc2067b124b5c14" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "merge_request_note" ADD CONSTRAINT "FK_f752ea8132b4daa68483ce030af" FOREIGN KEY ("merge_request_id") REFERENCES "merge_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "merge_request_note" DROP CONSTRAINT "FK_f752ea8132b4daa68483ce030af"`,
    );
    await queryRunner.query(`DROP TABLE "merge_request_note"`);
  }
}
