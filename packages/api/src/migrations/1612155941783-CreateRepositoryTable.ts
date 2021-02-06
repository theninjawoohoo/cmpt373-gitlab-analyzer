import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRepositoryTable1612155941783 implements MigrationInterface {
  name = 'CreateRepositoryTable1612155941783';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'repository',
        columns: [
          {
            name: 'repo_id',
            type: 'integer',
            isPrimary: true,
          },
          {
            name: 'repo_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'web_url',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'token',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'repo_detail',
            type: 'jsonb',
            isNullable: false,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('repository', true);
  }
}
