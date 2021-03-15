import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateScoringConfigEntity1615587956123
  implements MigrationInterface {
  name = 'CreateScoringConfigEntity1615587956123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "scoring_config" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resource" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_b3a2220996ee445d1724fedf2cd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "scoring_config" ADD CONSTRAINT "FK_3b79962496415c89785fe52616c" FOREIGN KEY ("user_id") REFERENCES "user_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "scoring_config" DROP CONSTRAINT "FK_3b79962496415c89785fe52616c"`,
    );
    await queryRunner.query(`DROP TABLE "scoring_config"`);
  }
}
