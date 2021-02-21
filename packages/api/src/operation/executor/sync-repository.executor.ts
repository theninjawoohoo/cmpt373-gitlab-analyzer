import { Operation } from '@ceres/types';
import { Repository as TypeORMRepository } from 'typeorm';
import { MergeRequestService } from '../../gitlab/merge-request/merge-request.service';
import { CommitService } from '../../gitlab/repository/commit/commit.service';
import { CommitDailyCountService } from '../../gitlab/repository/commit/daily-count/daily-count.service';
import { Repository } from '../../gitlab/repository/repository.entity';
import { RepositoryService } from '../../gitlab/repository/repository.service';
import { GitlabTokenService } from '../../gitlab/services/gitlab-token.service';
import { Operation as OperationEntity } from '../operation.entity';

enum Stage {
  syncCommits = 'syncCommits',
  syncMergeRequests = 'syncMergeRequests',
  linkCommitsAndMergeRequests = 'linkCommitsAndMergeRequests',
  createDailyCommitCaches = 'createDailyCommitCaches',
}

export class SyncRepositoryExecutor {
  constructor(
    private operation: OperationEntity,
    private readonly operationRepository: TypeORMRepository<OperationEntity>,
    private readonly tokenService: GitlabTokenService,
    private readonly commitService: CommitService,
    private readonly mergeRequestService: MergeRequestService,
    private readonly repositoryService: RepositoryService,
    private readonly commitDailyCountService: CommitDailyCountService,
  ) {}

  private stages = {
    [Stage.syncCommits]: this.createStage('Sync Commits'),
    [Stage.syncMergeRequests]: this.createStage('Sync Merge Requests'),
    [Stage.linkCommitsAndMergeRequests]: this.createStage(
      'Link Commits and Merge Requests',
    ),
    [Stage.createDailyCommitCaches]: this.createStage(
      'Create Daily Commit Caches',
    ),
  };
  private repository: Repository;
  private token: string;

  async run() {
    await this.init();
    await Promise.all([
      this.syncResource(Stage.syncCommits, this.commitService),
      this.syncResource(Stage.syncMergeRequests, this.mergeRequestService),
    ]);
    await this.linkCommitsAndMergeRequests();
    await this.createDailyCommitCaches();
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
  }

  private async syncResource(
    name: Stage,
    service: CommitService | MergeRequestService,
  ): Promise<void> {
    await this.startStage(name);
    let resources = [];
    let page = 1;
    do {
      resources = await service.fetchByPage(this.token, this.repository, page);
      await service.syncForRepositoryPage(
        this.token,
        this.repository,
        resources,
      );
      page++;
    } while (resources.length > 0);
    await this.completeStage(name);
  }

  private async linkCommitsAndMergeRequests() {
    await this.startStage(Stage.linkCommitsAndMergeRequests);
    await this.mergeRequestService.linkCommitsForRepository(
      this.token,
      this.repository,
    );
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

  private createStage(name: string) {
    return {
      name,
      status: Operation.Status.PENDING,
      percentage: 0,
    } as Operation.Stage;
  }

  private async startStage(name: Stage) {
    await this.updateStage(name, {
      status: Operation.Status.PROCESSING,
      start_time: new Date().toISOString(),
    });
  }

  private async completeStage(name: Stage) {
    await this.updateStage(name, {
      status: Operation.Status.COMPLETED,
      end_time: new Date().toISOString(),
      percentage: 100,
    });
  }

  private async updateStage(name: Stage, properties: Partial<Operation.Stage>) {
    this.stages[name] = { ...this.stages[name], ...properties };
    this.operation.resource.stages = Object.values(this.stages);
    this.operation = await this.operationRepository.save(this.operation);
  }
}
