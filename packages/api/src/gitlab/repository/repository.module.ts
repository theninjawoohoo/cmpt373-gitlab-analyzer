import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from '../api/api.module';
import { CommitAuthor } from './commit/author/commit-author.entity';
import { CommitAuthorService } from './commit/author/commit-author.service';
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
import { MergeRequestNoteService } from './note/merge-request-note/merge-request-note.service';
import { MergeRequestNoteController } from './note/merge-request-note/merge-request-note.controller';
import { MergeRequestNote } from './note/merge-request-note/merge-request-note.entity';
import { Issue } from './issue/issue.entity';
import { IssueService } from './issue/issue.service';
import { IssueController } from './issue/issue.controller';

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
      CommitAuthor,
      MergeRequestNote,
      Issue,
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
    CommitAuthorService,
    MergeRequestNoteService,
    IssueService,
  ],
  controllers: [
    RepositoryController,
    CommitController,
    DiffController,
    MergeRequestNoteController,
    IssueController,
  ],
  exports: [
    RepositoryService,
    RepositoryMemberService,
    DiffService,
    CommitService,
    CommitDailyCountService,
    CommitAuthorService,
    MergeRequestNoteService,
    IssueService,
  ],
})
export class RepositoryModule {}
