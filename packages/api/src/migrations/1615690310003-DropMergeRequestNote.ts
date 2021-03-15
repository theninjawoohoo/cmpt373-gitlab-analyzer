import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropMergeRequestNote1615690310003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('merge_request_note');
  }

  down(queryRunner: QueryRunner): Promise<any> {
    return Promise.resolve(undefined);
  }
}
