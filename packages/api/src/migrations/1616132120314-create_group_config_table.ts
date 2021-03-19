import { MigrationInterface, QueryRunner } from 'typeorm';

export class createGroupConfigTable1616132120314 implements MigrationInterface {
  name = 'createGroupConfigTable1616132120314';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "group_config" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resource" jsonb NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_da86c7edf57f462384137cd1725" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_config" ADD CONSTRAINT "FK_fa3d6b02e092c90cdf1420eff98" FOREIGN KEY ("user_id") REFERENCES "user_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "group_config" DROP CONSTRAINT "FK_fa3d6b02e092c90cdf1420eff98"`,
    );
    await queryRunner.query(`DROP TABLE "group_config"`);
  }
}
