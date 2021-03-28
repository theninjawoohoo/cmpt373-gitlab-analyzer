import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropCommitDailyCountTable1616859391131
  implements MigrationInterface {
  name = 'DropCommitDailyCountTable1616859391131';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "commit_daily_count"`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return Promise.resolve(undefined);
  }
}
