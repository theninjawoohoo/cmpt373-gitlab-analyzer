import { Repository as TypeORMRepository } from 'typeorm/repository/Repository';
import { RepositoryService } from '../../gitlab/repository/repository.service';
import { GitlabTokenService } from '../../gitlab/services/gitlab-token.service';
import { Operation as OperationEntity } from '../operation.entity';
import { BaseExecutor } from './base.executor';

enum Stage {
  fetch = 'fetch',
}

export class FetchRepositoriesExecutor extends BaseExecutor<Stage> {
  constructor(
    operation: OperationEntity,
    operationRepository: TypeORMRepository<OperationEntity>,
    private readonly tokenService: GitlabTokenService,
    private readonly repositoryService: RepositoryService,
  ) {
    super(operation, operationRepository);
    this.addStage(Stage.fetch, 'Fetch Repositories');
  }

  private token: string;

  async run() {
    await this.init();
    await this.startStage(Stage.fetch);
    await this.repositoryService.fetchFromGitlabForUser(
      this.operation.user,
      this.token,
    );
    await this.completeStage(Stage.fetch);
  }

  async init() {
    const { token } = await this.tokenService.findOneByUserId(
      this.operation.user.id,
    );
    this.token = token;
  }
}
