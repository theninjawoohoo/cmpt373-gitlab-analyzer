import { Module } from '@nestjs/common';
import { GitlabTokenService } from './services/gitlab_token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GitlabToken } from './entities/gitlab_token.entity';
import { GitlabTokenController } from './token/gitlab_token.controller';
import { RepositoryModule } from './repository/repository.module';

@Module({
  imports: [TypeOrmModule.forFeature([GitlabToken]), RepositoryModule],
  controllers: [GitlabTokenController],
  providers: [GitlabTokenService],
  exports: [GitlabTokenService],
})
export class GitlabModule {}
