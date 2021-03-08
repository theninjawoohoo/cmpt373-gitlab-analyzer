import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from '../api/api.module';
import { MergeRequest } from './merge-request.entity';
import { MergeRequestService } from './merge-request.service';
import { MergeRequestController } from './merge-request.controller';
import { RepositoryModule } from '../repository/repository.module';
import { MergeRequestParticipant } from './merge-request-participant/merge-request-participant.entity';
import { MergeRequestParticipantService } from './merge-request-participant/merge-request-participant.service';
import { MergeRequestNote } from '../repository/note/merge-request-note/merge-request-note.entity';
import { MergeRequestNoteService } from '../repository/note/merge-request-note/merge-request-note.service';
import { MergeRequestNoteController } from '../repository/note/merge-request-note/merge-request-note.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MergeRequest,
      MergeRequestParticipant,
      MergeRequestNote,
    ]),
    ApiModule,
    RepositoryModule,
  ],
  providers: [
    MergeRequestService,
    MergeRequestParticipantService,
    MergeRequestNoteService,
  ],
  controllers: [MergeRequestController, MergeRequestNoteController],
  exports: [MergeRequestService, MergeRequestNoteService],
})
export class MergeRequestModule {}
