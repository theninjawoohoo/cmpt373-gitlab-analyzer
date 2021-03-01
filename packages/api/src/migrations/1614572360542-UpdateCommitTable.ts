import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateCommitTable1614572360542 implements MigrationInterface {
    name = 'UpdateCommitTable1614572360542'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "commit" DROP COLUMN "score"`);
        await queryRunner.query(`ALTER TABLE "commit" ADD "score" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "commit" DROP COLUMN "score"`);
        await queryRunner.query(`ALTER TABLE "commit" ADD "score" integer`);
    }

}
