import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMergeRequestParticipantTable1613471911681
  implements MigrationInterface {
  name = 'CreateMergeRequestParticipantTable1613471911681';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "merge_request_participant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resource" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "merge_request_id" uuid, CONSTRAINT "PK_2a81274be2f92c92996a3014199" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "merge_request_participant" ADD CONSTRAINT "FK_4db45139cd7b20a9d31ba4e704a" FOREIGN KEY ("merge_request_id") REFERENCES "merge_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "merge_request_participant" DROP CONSTRAINT "FK_4db45139cd7b20a9d31ba4e704a"`,
    );
    await queryRunner.query(`DROP TABLE "merge_request_participant"`);
  }
}
