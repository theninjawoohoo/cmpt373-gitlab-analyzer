import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNoteTableWithWordCount1615717750572
  implements MigrationInterface {
  name = 'CreateNoteTableWithWordCount1615717750572';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "note" ADD "word_count" integer`);
    await queryRunner.query(`ALTER TABLE "note" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "note" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "note" DROP COLUMN "updated_at"`);
    await queryRunner.query(
      `ALTER TABLE "note" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "issue" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "issue" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "issue" DROP COLUMN "updated_at"`);
    await queryRunner.query(
      `ALTER TABLE "issue" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "issue" DROP COLUMN "updated_at"`);
    await queryRunner.query(
      `ALTER TABLE "issue" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "issue" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "issue" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "note" DROP COLUMN "updated_at"`);
    await queryRunner.query(
      `ALTER TABLE "note" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "note" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "note" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "note" DROP COLUMN "word_count"`);
  }
}
