import { Module } from '@nestjs/common';
import { GitlabTokenService } from './services/gitlab-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GitlabToken } from './entities/gitlab-token.entity';
import { GitlabTokenController } from './token/gitlab-token.controller';
import { RepositoryModule } from './repository/repository.module';
import { MergeRequestModule } from './merge-request/merge-request.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GitlabToken]),
    RepositoryModule,
    MergeRequestModule,
  ],
  controllers: [GitlabTokenController],
  providers: [GitlabTokenService],
  exports: [GitlabTokenService],
})
export class GitlabModule {}
