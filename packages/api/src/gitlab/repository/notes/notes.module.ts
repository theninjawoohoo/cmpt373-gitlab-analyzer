import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from '../../api/api.module';
import { Note } from './notes.entity';
import { NoteService } from './notes.service';
import { NotesController } from './notes.controller';
import { RepositoryModule } from '../../repository/repository.module';
import { MergeRequestModule } from '../../merge-request/merge-request.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Note]),
    ApiModule,
    RepositoryModule,
    MergeRequestModule,
  ],
  providers: [NoteService],
  controllers: [NotesController],
})
export class NotesModule {}
