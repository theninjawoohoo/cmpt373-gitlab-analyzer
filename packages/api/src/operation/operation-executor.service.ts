import { Operation } from '@ceres/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operation as OperationEntity } from './operation.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OperationExecutorService {
  constructor(
    @InjectRepository(OperationEntity)
    private readonly operationRepository: Repository<OperationEntity>,
  ) {}

  execute(operation: OperationEntity) {
    console.log(`Starting execution for operation: ${operation.id}`);
    operation.resource = this.updateStatus(operation.resource);
    return this.operationRepository.save(operation);
  }

  private updateStatus(operation: Operation) {
    operation.status.stage = Operation.Stage.COMPLETED;
    operation.status.start_time = new Date().toISOString();
    operation.status.end_time = new Date().toISOString();
    return operation;
  }
}
