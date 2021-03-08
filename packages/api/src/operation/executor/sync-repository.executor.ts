import { Operation } from '@ceres/types';
import { Repository as TypeORMRepository } from 'typeorm';
import { MergeRequestService } from '../../gitlab/merge-request/merge-request.service';
import { CommitAuthorService } from '../../gitlab/repository/commit/author/commit-author.service';
import { CommitService } from '../../gitlab/repository/commit/commit.service';
import { CommitDailyCountService } from '../../gitlab/repository/commit/daily-count/daily-count.service';
import { RepositoryMember } from '../../gitlab/repository/repository-member/repository-member.entity';
import { RepositoryMemberService } from '../../gitlab/repository/repository-member/repository-member.service';
import { Repository } from '../../gitlab/repository/repository.entity';
import { RepositoryService } from '../../gitlab/repository/repository.service';
import { GitlabTokenService } from '../../gitlab/services/gitlab-token.service';
import { Operation as OperationEntity } from '../operation.entity';
import { BaseExecutor } from './base.executor';

enum Stage {
  syncCommits = 'syncCommits',
  syncMergeRequests = 'syncMergeRequests',
  linkCommitsAndMergeRequests = 'linkCommitsAndMergeRequests',
  linkNotesAndMergeRequests = 'linkNotesAndMergeRequests',
  createDailyCommitCaches = 'createDailyCommitCaches',
  linkAuthors = 'linkAuthors',
}

export class SyncRepositoryExecutor extends BaseExecutor<Stage> {
  constructor(
    operation: OperationEntity,
    operationRepository: TypeORMRepository<OperationEntity>,
    private readonly tokenService: GitlabTokenService,
    private readonly commitService: CommitService,
    private readonly mergeRequestService: MergeRequestService,
    private readonly repositoryService: RepositoryService,
    private readonly commitDailyCountService: CommitDailyCountService,
    private readonly commitAuthorService: CommitAuthorService,
    private readonly repositoryMemberService: RepositoryMemberService,
  ) {
    super(operation, operationRepository);
    this.addStage(Stage.syncCommits, 'Sync Commits');
    this.addStage(Stage.syncMergeRequests, 'Sync Merge Requests');
    this.addStage(
      Stage.linkCommitsAndMergeRequests,
      'Link Commits and Merge Requests',
    );
    this.addStage(Stage.createDailyCommitCaches, 'Create Daily Commit Caches');
    this.addStage(Stage.linkAuthors, 'Link Authors');
  }

  private repository: Repository;
  private token: string;
  private members: RepositoryMember[] = [];

  async run() {
    await this.init();
    await Promise.all([
      this.syncResource(Stage.syncCommits, this.commitService),
      this.syncResource(Stage.syncMergeRequests, this.mergeRequestService),
    ]);
    await Promise.all([
      this.linkCommitsAndMergeRequests(),
      this.createDailyCommitCaches(),
      this.linkAuthors(),
    ]);
  }

  private async init() {
    const payload = this.operation.resource
      .input as Operation.SyncRepositoryPayload;
    const repository = await this.repositoryService.findOne(
      payload.repository_id,
    );
    const { token } = await this.tokenService.findOneByUserId(
      this.operation.user.id,
    );
    this.repository = repository;
    this.token = token;
    this.members = await this.repositoryMemberService.findAllForRepository(
      repository,
    );
    await this.updateLastSync();
  }

  private async updateLastSync() {
    this.repository = await this.repositoryService.updateLastSync(
      this.repository,
    );
  }

  private async syncResource(
    name: Stage,
    service: CommitService | MergeRequestService,
  ): Promise<void> {
    await this.startStage(name);
    let resources = [];
    let page = 1;
    do {
      try {
        resources = await service.fetchByPage(
          this.token,
          this.repository,
          page,
        );
        await service.syncForRepositoryPage(
          this.token,
          this.repository,
          resources,
        );
      } catch {}
      page++;
    } while (resources.length > 0);
    await this.completeStage(name);
  }

  private async linkCommitsAndMergeRequests() {
    await this.startStage(Stage.linkCommitsAndMergeRequests);
    try {
      await this.mergeRequestService.linkCommitsForRepository(
        this.token,
        this.repository,
      );
    } catch {}

    await this.completeStage(Stage.linkCommitsAndMergeRequests);
  }

  private async createDailyCommitCaches() {
    await this.startStage(Stage.createDailyCommitCaches);
    const dailyCounts = await this.commitService.createDailyCache(
      this.repository,
    );
    await this.commitDailyCountService.clear(this.repository.id);
    await this.commitDailyCountService.createAll(
      dailyCounts,
      this.repository.id,
    );
    await this.completeStage(Stage.createDailyCommitCaches);
  }

  private async linkAuthors() {
    await this.startStage(Stage.linkAuthors);
    const uniqueAuthors = await this.commitService.getDistinctAuthors(
      this.repository,
    );
    const storedAuthors = await this.commitAuthorService.findAllForRepository(
      this.repository,
    );
    await Promise.all(
      uniqueAuthors.map(async (author) => {
        const authorEntity = storedAuthors.find(
          (a) =>
            a.resource.author_name === author.author_name &&
            a.resource.author_email === author.author_email,
        );
        if (!authorEntity) {
          const repositoryMember = this.members.find((member) => {
            return member.resource.name === author.author_name;
          });
          if (repositoryMember) {
            author.repository_member_id = repositoryMember.id;
          }
          await this.commitAuthorService.create(
            author,
            this.repository,
            repositoryMember,
          );
        }
      }),
    );
    await this.completeStage(Stage.linkAuthors);
  }
}
