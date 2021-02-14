import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRepositoryMemberTable1613262171841
  implements MigrationInterface {
  name = 'CreateRepositoryMemberTable1613262171841';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "repository_member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resource" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "repository_id" uuid, CONSTRAINT "PK_62dac59e24a78c1cfa6911bd772" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "repository_member" ADD CONSTRAINT "FK_29f90c94646980c212220e4e9ea" FOREIGN KEY ("repository_id") REFERENCES "repository"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "repository_member" DROP CONSTRAINT "FK_29f90c94646980c212220e4e9ea"`,
    );
    await queryRunner.query(`DROP TABLE "repository_member"`);
  }
}
