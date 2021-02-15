import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from '../api/api.module';
import { MergeRequest } from './mergeRequest.entity';
import { MergeRequestService } from './mergeRequest.service';
import { MergeRequestController } from './mergeRequest.controller';
import { RepositoryModule } from '../repository/repository.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MergeRequest]),
    ApiModule,
    RepositoryModule
  ],
  providers: [MergeRequestService],
  controllers: [MergeRequestController],
})
export class MergeRequestModule {}
