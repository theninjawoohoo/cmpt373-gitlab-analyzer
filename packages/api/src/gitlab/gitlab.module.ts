import { Module } from '@nestjs/common';
import { TokenController } from './token/token.controller';
import { TokenService } from './services/gitlab_token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GitlabToken } from './entities/gitlab_token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GitlabToken])],
  controllers: [TokenController],
  providers: [TokenService],
})
export class GitlabModule {}
