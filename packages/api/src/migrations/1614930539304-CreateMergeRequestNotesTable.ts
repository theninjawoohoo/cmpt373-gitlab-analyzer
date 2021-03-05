import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMergeRequestNotesTable1614930539304
  implements MigrationInterface {
  name = 'CreateMergeRequestNotesTable1614930539304';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "notes"."id" IS NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "notes"."id" IS NULL`);
  }
}
