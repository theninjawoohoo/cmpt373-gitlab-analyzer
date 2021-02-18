import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCommitToMergeRequestRelationship1613631792035
  implements MigrationInterface {
  name = 'CreateCommitToMergeRequestRelationship1613631792035';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "merge_request_commits_commit" ("mergeRequestId" uuid NOT NULL, "commitId" uuid NOT NULL, CONSTRAINT "PK_cce94246c2a10b72947210dc144" PRIMARY KEY ("mergeRequestId", "commitId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_20a716f4e958c6083a65cc42e4" ON "merge_request_commits_commit" ("mergeRequestId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4a52f02fa48c5bdd08da4e6b4a" ON "merge_request_commits_commit" ("commitId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "merge_request_commits_commit" ADD CONSTRAINT "FK_20a716f4e958c6083a65cc42e49" FOREIGN KEY ("mergeRequestId") REFERENCES "merge_request"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "merge_request_commits_commit" ADD CONSTRAINT "FK_4a52f02fa48c5bdd08da4e6b4aa" FOREIGN KEY ("commitId") REFERENCES "commit"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "merge_request_commits_commit" DROP CONSTRAINT "FK_4a52f02fa48c5bdd08da4e6b4aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "merge_request_commits_commit" DROP CONSTRAINT "FK_20a716f4e958c6083a65cc42e49"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_4a52f02fa48c5bdd08da4e6b4a"`);
    await queryRunner.query(`DROP INDEX "IDX_20a716f4e958c6083a65cc42e4"`);
    await queryRunner.query(`DROP TABLE "merge_request_commits_commit"`);
  }
}
