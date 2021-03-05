import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { GitlabTokenService } from './services/gitlab-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GitlabToken } from './entities/gitlab-token.entity';
import { GitlabTokenController } from './token/gitlab-token.controller';
import { RepositoryModule } from './repository/repository.module';
import { MergeRequestModule } from './merge-request/merge-request.module';
import { NotesModule } from './repository/notes/notes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GitlabToken]),
    ApiModule,
    RepositoryModule,
    MergeRequestModule,
    NotesModule,
  ],
  controllers: [GitlabTokenController],
  providers: [GitlabTokenService],
  exports: [GitlabTokenService],
})
export class GitlabModule {}
