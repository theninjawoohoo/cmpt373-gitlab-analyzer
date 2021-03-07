import { Operation } from '@ceres/types';
import { Repository as TypeORMRepository } from 'typeorm/repository/Repository';
import { Operation as OperationEntity } from '../operation.entity';

export class BaseExecutor<TStage extends string> {
  private stages: { [key in TStage]?: Operation.Stage } = {};

  constructor(
    protected operation: OperationEntity,
    private readonly operationRepository: TypeORMRepository<OperationEntity>,
  ) {}

  protected addStage(key: TStage, name: string) {
    this.stages[key] = {
      name,
      status: Operation.Status.PENDING,
      percentage: 0,
    };
  }

  protected async startStage(key: TStage) {
    await this.updateStage(key, {
      status: Operation.Status.PROCESSING,
      start_time: new Date().toISOString(),
    });
  }

  protected async completeStage(key: TStage) {
    await this.updateStage(key, {
      status: Operation.Status.COMPLETED,
      end_time: new Date().toISOString(),
      percentage: 100,
    });
  }

  protected async updateStage(
    key: TStage,
    properties: Partial<Operation.Stage>,
  ) {
    this.stages[key] = { ...this.stages[key], ...properties };
    this.operation.resource.stages = Object.values(this.stages);
    this.operation = await this.operationRepository.save(this.operation);
  }
}
