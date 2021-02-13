import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationController } from './operation.controller';
import { Operation } from './operation.entity';
import { OperationService } from './operation.service';
import { OperationExecutorService } from './operation-executor.service';

@Module({
  imports: [TypeOrmModule.forFeature([Operation])],
  controllers: [OperationController],
  providers: [OperationService, OperationExecutorService],
})
export class OperationModule {}
