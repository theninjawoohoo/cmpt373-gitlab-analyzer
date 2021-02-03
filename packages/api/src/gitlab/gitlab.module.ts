import { Module } from '@nestjs/common';
import { GitlabTokenService } from './services/gitlab_token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GitlabToken } from './entities/gitlab_token.entity';
import { GitlabTokenController } from './token/gitlab_token.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GitlabToken])],
  controllers: [GitlabTokenController],
  providers: [GitlabTokenService],
})
export class GitlabModule {}
