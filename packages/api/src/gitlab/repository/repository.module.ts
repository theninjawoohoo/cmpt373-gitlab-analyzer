import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from '../api/api.module';
import { Diff } from './diff/diff.entity';
import { RepositoryMember } from './repository-member/repository-member.entity';
import { Repository } from './repository.entity';
import { RepositoryService } from './repository.service';
import { RepositoryController } from './repository.controller';
import { RepositoryMemberService } from './repository-member/repository-member.service';
import { CommitService } from './commit/commit.service';
import { Commit } from './commit/commit.entity';
import { DiffService } from './diff/diff.service';
import { CommitController } from './commit/commit.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Repository, RepositoryMember, Commit, Diff]),
    ApiModule,
  ],
  providers: [
    RepositoryService,
    RepositoryMemberService,
    CommitService,
    DiffService,
  ],
  controllers: [RepositoryController, CommitController],
  exports: [RepositoryService, DiffService, CommitService],
})
export class RepositoryModule {}
