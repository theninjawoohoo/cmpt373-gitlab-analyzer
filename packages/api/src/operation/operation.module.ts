import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GitlabModule } from '../gitlab/gitlab.module';
import { MergeRequestModule } from '../gitlab/merge-request/merge-request.module';
import { RepositoryModule } from '../gitlab/repository/repository.module';
import { OperationController } from './operation.controller';
import { Operation } from './operation.entity';
import { OperationService } from './operation.service';
import { OperationExecutorService } from './operation-executor.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Operation]),
    RepositoryModule,
    GitlabModule,
    MergeRequestModule,
  ],
  controllers: [OperationController],
  providers: [OperationService, OperationExecutorService],
})
export class OperationModule {}
