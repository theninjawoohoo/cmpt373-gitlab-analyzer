import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateMergeRequestTable1613363938398 implements MigrationInterface {
    name = 'CreateMergeRequestTable1613363938398'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "merge_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resource" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "repository_id" uuid, CONSTRAINT "PK_dac26612dc914df81d07cc7cecf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "merge_request" ADD CONSTRAINT "FK_24f6061fa3437dfc2e1577723e2" FOREIGN KEY ("repository_id") REFERENCES "repository"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merge_request" DROP CONSTRAINT "FK_24f6061fa3437dfc2e1577723e2"`);
        await queryRunner.query(`DROP TABLE "merge_request"`);
    }

}
