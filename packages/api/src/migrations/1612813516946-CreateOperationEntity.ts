import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOperationEntity1612813516946 implements MigrationInterface {
  name = 'CreateOperationEntity1612813516946';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "operation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resource" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_18556ee6e49c005fc108078f3ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "operation" ADD CONSTRAINT "FK_cfa8dd65df7df579953268253bf" FOREIGN KEY ("user_id") REFERENCES "user_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operation" DROP CONSTRAINT "FK_cfa8dd65df7df579953268253bf"`,
    );
    await queryRunner.query(`DROP TABLE "operation"`);
  }
}
