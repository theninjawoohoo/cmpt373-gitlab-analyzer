import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDiffTable1613438160341 implements MigrationInterface {
  name = 'CreateDiffTable1613438160341';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "diff" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resource" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "commit_id" uuid, "merge_request_id" uuid, CONSTRAINT "PK_b322809b437dbe09e4a9dc19aca" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "diff" ADD CONSTRAINT "FK_1bc0e37ef1a31b563f155b1e761" FOREIGN KEY ("commit_id") REFERENCES "commit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "diff" ADD CONSTRAINT "FK_c7dd3e33f6ad73c16645ceccde4" FOREIGN KEY ("merge_request_id") REFERENCES "merge_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "diff" DROP CONSTRAINT "FK_c7dd3e33f6ad73c16645ceccde4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "diff" DROP CONSTRAINT "FK_1bc0e37ef1a31b563f155b1e761"`,
    );
    await queryRunner.query(`DROP TABLE "diff"`);
  }
}
