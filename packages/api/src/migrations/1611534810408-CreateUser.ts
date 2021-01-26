import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUser1611534810408 implements MigrationInterface {
  name = 'CreateUser1611534810408';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.createTable(
      new Table({
        name: 'user_profile',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'auth',
            isNullable: false,
            type: 'jsonb',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_profile', true);
  }
}
