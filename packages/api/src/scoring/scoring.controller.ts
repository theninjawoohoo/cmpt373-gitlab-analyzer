import { BadRequestException } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { RepositoryService } from '../gitlab/repository/repository.service';
import { ScoringConfig } from './scoring-config/scoring-config.entity';
import { ScoringConfigService } from './scoring-config/scoring-config.service';
import {
  UpdateScoreOverridesPayload,
  UpdateScoringPayload,
} from './scoring.payloads';
import { ScoringService } from './scoring.service';

@Controller('scoring')
export class ScoringController {
  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly scoringConfigService: ScoringConfigService,
    private readonly scoringService: ScoringService,
  ) {}

  @Post()
  async updateRepositoryScores(@Body() config: UpdateScoringPayload) {
    const repository = await this.repositoryService.findOne(
      config.repositoryId,
    );
    let scoringConfig: ScoringConfig;
    if (config.scoringConfigId) {
      scoringConfig = await this.scoringConfigService.findOne(
        config.scoringConfigId,
      );
    }
    await this.scoringService.updateRepositoryScores(
      repository,
      scoringConfig,
      config.overrides,
    );
  }

  @Post('override')
  async updateScoreOverrides(@Body() config: UpdateScoreOverridesPayload) {
    const repository = await this.repositoryService.findOne(
      config.repositoryId,
    );
    if (!repository) {
      throw new BadRequestException('Invalid repository id');
    }
    await this.scoringService.updateOverrides(config.overrides);

    // We need to rescore commits and diff once the overrides have changed.
    const scoringConfig = await this.scoringConfigService.findOne(
      repository?.resource?.extensions?.scoringConfig?.id,
    );
    const scoringConfigOverrides =
      repository?.resource?.extensions?.scoringConfig?.overrides;
    await this.scoringService.updateOverrides(config.overrides);
    await this.scoringService.updateRepositoryScores(
      repository,
      scoringConfig,
      scoringConfigOverrides,
    );
  }
}
