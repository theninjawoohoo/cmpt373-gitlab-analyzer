import { Module } from '@nestjs/common';
import { ScoringConfigModule } from './scoring-config/scoring-config.module';
import { ScoringController } from './scoring.controller';

@Module({
  imports: [ScoringConfigModule],
  controllers: [ScoringController],
})
export class ScoringModule {}
