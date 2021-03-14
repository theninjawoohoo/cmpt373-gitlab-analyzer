import {MigrationInterface, QueryRunner} from "typeorm";

export class updateTimestampColumns1615603543107 implements MigrationInterface {
    name = 'updateTimestampColumns1615603543107'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "diff" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "diff" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "diff" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "diff" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "scoring_config" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "scoring_config" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "scoring_config" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "scoring_config" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "operation" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "operation" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "operation" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "operation" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "repository_member" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "repository_member" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "repository_member" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "repository_member" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "commit_author" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "commit_author" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "commit_author" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "commit_author" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "repository" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "repository" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "repository" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "repository" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "commit" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "commit" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "commit" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "commit" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "merge_request_note" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "merge_request_note" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "merge_request_note" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "merge_request_note" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "merge_request" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "merge_request" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "merge_request" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "merge_request" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "merge_request_participant" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "merge_request_participant" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "merge_request_participant" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "merge_request_participant" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "commit_daily_count" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "commit_daily_count" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "commit_daily_count" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "commit_daily_count" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "commit_daily_count" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "commit_daily_count" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "commit_daily_count" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "commit_daily_count" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "merge_request_participant" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "merge_request_participant" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "merge_request_participant" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "merge_request_participant" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "merge_request" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "merge_request" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "merge_request" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "merge_request" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "merge_request_note" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "merge_request_note" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "merge_request_note" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "merge_request_note" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "commit" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "commit" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "commit" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "commit" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "repository" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "repository" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "repository" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "repository" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "commit_author" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "commit_author" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "commit_author" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "commit_author" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "repository_member" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "repository_member" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "repository_member" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "repository_member" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "operation" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "operation" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "operation" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "operation" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "scoring_config" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "scoring_config" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "scoring_config" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "scoring_config" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "diff" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "diff" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "diff" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "diff" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
