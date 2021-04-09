import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropNoteTable1618008157635 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('note');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return Promise.resolve(undefined);
  }
}
