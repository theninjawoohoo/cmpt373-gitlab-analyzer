import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateRepositoryTable1612155941783 implements MigrationInterface {
    name = 'CreateRepositoryTable1612155941783'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "repository" DROP CONSTRAINT "PK_b842c26651c6fc0b9ccd1c530e2"`);
        await queryRunner.query(`ALTER TABLE "repository" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "repository" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "repository" DROP COLUMN "detail"`);
        await queryRunner.query(`ALTER TABLE "repository" ADD "repo_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "repository" ADD CONSTRAINT "PK_271493cd9c02a3566aba9d21763" PRIMARY KEY ("repo_id")`);
        await queryRunner.query(`ALTER TABLE "repository" ADD "repo_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "repository" ADD "repo_detail" jsonb NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "repository" DROP COLUMN "repo_detail"`);
        await queryRunner.query(`ALTER TABLE "repository" DROP COLUMN "repo_name"`);
        await queryRunner.query(`ALTER TABLE "repository" DROP CONSTRAINT "PK_271493cd9c02a3566aba9d21763"`);
        await queryRunner.query(`ALTER TABLE "repository" DROP COLUMN "repo_id"`);
        await queryRunner.query(`ALTER TABLE "repository" ADD "detail" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "repository" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "repository" ADD "id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "repository" ADD CONSTRAINT "PK_b842c26651c6fc0b9ccd1c530e2" PRIMARY KEY ("id")`);
    }

}
