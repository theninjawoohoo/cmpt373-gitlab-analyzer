import { StagedScoreOverride } from '@ceres/types';
import { BadRequestException } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { DiffService } from 'src/gitlab/repository/diff/diff.service';
import { RepositoryService } from 'src/gitlab/repository/repository.service';
import { MergeRequestService } from '../gitlab/merge-request/merge-request.service';
import { CommitService } from '../gitlab/repository/commit/commit.service';
import { ScoringConfig } from './scoring-config/scoring-config.entity';
import { ScoringConfigService } from './scoring-config/scoring-config.service';
import {
  UpdateScoreOverridesPayload,
  UpdateScoringPayload,
} from './scoring.payloads';

@Controller('scoring')
export class ScoringController {
  constructor(
    private readonly mergeRequestService: MergeRequestService,
    private readonly commitService: CommitService,
    private readonly repositoryService: RepositoryService,
    private readonly scoringConfigService: ScoringConfigService,
    private readonly diffService: DiffService,
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
    await Promise.all([
      this.mergeRequestService.updateMergeRequestScoreByRepository(
        config.repositoryId,
        scoringConfig?.resource?.weights,
      ),
      this.commitService.updateCommitScoreByRepository(
        config.repositoryId,
        scoringConfig?.resource?.weights,
      ),
    ]);
    await this.repositoryService.updateScoringConfig(repository, {
      config: scoringConfig?.resource,
      id: config.scoringConfigId,
      lastRan: new Date().toISOString(),
    });
  }

  @Post('override')
  async updateScoreOverrides(@Body() config: UpdateScoreOverridesPayload) {
    const repository = await this.repositoryService.findOne(
      config.repositoryId,
    );
    if (!repository) {
      throw new BadRequestException('Invalid repository id');
    }
    const diffOverrides = StagedScoreOverride.getDiffOverrides(
      config.overrides,
    );
    await Promise.all(
      diffOverrides.map((override) => {
        const { id } = StagedScoreOverride.parseEntityId(override.id);
        this.diffService.updateOverride(id, override.override);
      }),
    );
  }
}
