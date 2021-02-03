import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixGitlabTokenRelationship1612336481729
  implements MigrationInterface {
  name = 'FixGitlabTokenRelationship1612336481729';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gitlab_token" DROP CONSTRAINT "FK_960460c5e069493892bedcee6e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gitlab_token" DROP CONSTRAINT "UQ_960460c5e069493892bedcee6e1"`,
    );
    await queryRunner.query(`ALTER TABLE "gitlab_token" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "gitlab_token" ADD "user_id" text NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gitlab_token" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "gitlab_token" ADD "user_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "gitlab_token" ADD CONSTRAINT "UQ_960460c5e069493892bedcee6e1" UNIQUE ("user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "gitlab_token" ADD CONSTRAINT "FK_960460c5e069493892bedcee6e1" FOREIGN KEY ("user_id") REFERENCES "user_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
