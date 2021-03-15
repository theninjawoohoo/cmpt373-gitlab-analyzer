import { Module } from '@nestjs/common';
import { GitlabModule } from 'src/gitlab/gitlab.module';
import { ScoringConfigModule } from './scoring-config/scoring-config.module';
import { ScoringController } from './scoring.controller';

@Module({
  imports: [ScoringConfigModule, GitlabModule],
  controllers: [ScoringController],
})
export class ScoringModule {}
