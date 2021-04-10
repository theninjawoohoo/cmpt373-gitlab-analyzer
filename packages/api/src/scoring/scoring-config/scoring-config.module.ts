import { HttpModule, Module } from '@nestjs/common';
import { ScoringConfigService } from './scoring-config.service';
import { ScoringConfigController } from './scoring-config.controller';
import { ScoringConfig } from './scoring-config.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ScoringConfig]), HttpModule],
  providers: [ScoringConfigService],
  controllers: [ScoringConfigController],
  exports: [ScoringConfigService],
})
export class ScoringConfigModule {}
