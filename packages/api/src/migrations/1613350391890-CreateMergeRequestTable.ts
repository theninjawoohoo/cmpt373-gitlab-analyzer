import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateMergeRequestTable1613350391890 implements MigrationInterface {
    name = 'CreateMergeRequestTable1613350391890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mergeRequest" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resource" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "repository_id" uuid, CONSTRAINT "PK_1badf8101412779639ae25cae5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "mergeRequest" ADD CONSTRAINT "FK_5f552cbfdc55b89ce999e22affe" FOREIGN KEY ("repository_id") REFERENCES "repository"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mergeRequest" DROP CONSTRAINT "FK_5f552cbfdc55b89ce999e22affe"`);
        await queryRunner.query(`DROP TABLE "mergeRequest"`);
    }

}
