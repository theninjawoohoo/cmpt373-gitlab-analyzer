import { Module } from '@nestjs/common';
import { GitlabModule } from 'src/gitlab/gitlab.module';
import { ScoringConfigModule } from './scoring-config/scoring-config.module';
import { ScoringController } from './scoring.controller';
import { ScoringService } from './scoring.service';

@Module({
  imports: [ScoringConfigModule, GitlabModule],
  controllers: [ScoringController],
  providers: [ScoringService],
})
export class ScoringModule {}
