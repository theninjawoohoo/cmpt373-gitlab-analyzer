import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from '../api/api.module';
import { MergeRequest } from './merge-request.entity';
import { MergeRequestService } from './merge-request.service';
import { MergeRequestController } from './merge-request.controller';
import { RepositoryModule } from '../repository/repository.module';
import { MergeRequestParticipant } from './merge-request-participant/merge-request-participant.entity';
import { MergeRequestParticipantService } from './merge-request-participant/merge-request-participant.service';
import { Note } from '../repository/note/note.entity';
import { NoteService } from '../repository/note/note.service';
import { NoteController } from '../repository/note/note.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([MergeRequest, MergeRequestParticipant, Note]),
    ApiModule,
    RepositoryModule,
  ],
  providers: [MergeRequestService, MergeRequestParticipantService, NoteService],
  controllers: [MergeRequestController, NoteController],
  exports: [MergeRequestService, NoteService],
})
export class MergeRequestModule {}
