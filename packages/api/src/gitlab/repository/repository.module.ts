import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from '../api/api.module';
import { CommitDailyCount } from './commit/daily-count/daily-count.entity';
import { CommitDailyCountService } from './commit/daily-count/daily-count.service';
import { Diff } from './diff/diff.entity';
import { RepositoryMember } from './repository-member/repository-member.entity';
import { Repository } from './repository.entity';
import { RepositoryService } from './repository.service';
import { RepositoryController } from './repository.controller';
import { RepositoryMemberService } from './repository-member/repository-member.service';
import { MergeRequestService } from '../merge-request/merge-request.service';
import { MergeRequestParticipantService } from '../merge-request/merge-request-participant/merge-request-participant.service';
import { MergeRequest } from '../merge-request/merge-request.entity';
import { MergeRequestParticipant } from '../merge-request/merge-request-participant/merge-request-participant.entity';
import { CommitService } from './commit/commit.service';
import { Commit } from './commit/commit.entity';
import { DiffService } from './diff/diff.service';
import { CommitController } from './commit/commit.controller';
import { DiffController } from './diff/diff.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Repository,
      RepositoryMember,
      Commit,
      Diff,
      MergeRequest,
      MergeRequestParticipant,
      CommitDailyCount,
    ]),
    ApiModule,
  ],
  providers: [
    RepositoryService,
    RepositoryMemberService,
    MergeRequestService,
    MergeRequestParticipantService,
    CommitService,
    DiffService,
    CommitDailyCountService,
  ],
  controllers: [RepositoryController, CommitController, DiffController],
  exports: [
    RepositoryService,
    DiffService,
    CommitService,
    CommitDailyCountService,
  ],
})
export class RepositoryModule {}
