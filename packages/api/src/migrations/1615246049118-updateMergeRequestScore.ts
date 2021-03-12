import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateMergeRequestScore1615246049118
  implements MigrationInterface {
  name = 'updateMergeRequestScore1615246049118';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "merge_request" DROP COLUMN "diffScore"`,
    );
    await queryRunner.query(
      `ALTER TABLE "merge_request" DROP COLUMN "commitScore"`,
    );
    await queryRunner.query(
      `ALTER TABLE "merge_request" ADD "diff_score" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "merge_request" ADD "commit_score_sum" double precision`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "merge_request" DROP COLUMN "commit_score_sum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "merge_request" DROP COLUMN "diff_score"`,
    );
    await queryRunner.query(
      `ALTER TABLE "merge_request" ADD "commitScore" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "merge_request" ADD "diffScore" double precision`,
    );
  }
}
