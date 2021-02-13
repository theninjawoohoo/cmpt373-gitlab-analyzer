import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProfileColumnToUser1612733696525 implements MigrationInterface {
  name = 'AddProfileColumnToUser1612733696525';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_profile" ADD "profile" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "profile"`);
  }
}
