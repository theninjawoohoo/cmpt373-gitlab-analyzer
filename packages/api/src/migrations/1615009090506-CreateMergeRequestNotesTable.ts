import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMergeRequestNotesTable1615009090506
  implements MigrationInterface {
  name = 'CreateMergeRequestNotesTable1615009090506';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "merge_request_note" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resource" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "mergeRequestId" uuid, CONSTRAINT "PK_6602488f85e1fc2067b124b5c14" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "merge_request_note" ADD CONSTRAINT "FK_ec23b6d892e0ce049962bc3f746" FOREIGN KEY ("mergeRequestId") REFERENCES "merge_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "merge_request_note" DROP CONSTRAINT "FK_ec23b6d892e0ce049962bc3f746"`,
    );
    await queryRunner.query(`DROP TABLE "merge_request_note"`);
  }
}
