import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from '../api/api.module';
import { MergeRequest } from './merge-request.entity';
import { MergeRequestService } from './merge-request.service';
import { MergeRequestController } from './merge-request.controller';
import { RepositoryModule } from '../repository/repository.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MergeRequest]),
    ApiModule,
    RepositoryModule,
  ],
  providers: [MergeRequestService],
  controllers: [MergeRequestController],
  exports: [MergeRequestService],
})
export class MergeRequestModule {}
