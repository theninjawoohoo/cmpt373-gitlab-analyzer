import { Operation } from '@ceres/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MergeRequestService } from '../gitlab/merge-request/merge-request.service';
import { CommitService } from '../gitlab/repository/commit/commit.service';
import { RepositoryService } from '../gitlab/repository/repository.service';
import { GitlabTokenService } from '../gitlab/services/gitlab-token.service';
import { SyncRepositoryExecutor } from './executor/sync-repository.executor';
import { Operation as OperationEntity } from './operation.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OperationExecutorService {
  constructor(
    @InjectRepository(OperationEntity)
    private readonly operationRepository: Repository<OperationEntity>,
    private readonly tokenService: GitlabTokenService,
    private readonly commitService: CommitService,
    private readonly mergeRequestService: MergeRequestService,
    private readonly repositoryService: RepositoryService,
  ) {}

  async execute(operation: OperationEntity) {
    console.log(`Starting execution for operation: ${operation.id}`);
    operation.resource = this.startOperation(operation.resource);
    switch (operation.resource.type) {
      case Operation.Type.SYNC_REPOSITORY:
        await this.executeSyncRepositoryOperation(operation);
        break;
    }
    return this.operationRepository.save(operation);
  }

  private startOperation(operation: Operation) {
    operation.start_time = new Date().toISOString();
    operation.status = Operation.Status.PROCESSING;
    return operation;
  }

  private async executeSyncRepositoryOperation(operation: OperationEntity) {
    const executor = new SyncRepositoryExecutor(
      operation,
      this.operationRepository,
      this.tokenService,
      this.commitService,
      this.mergeRequestService,
      this.repositoryService,
    );
    await executor.run();
  }
}
