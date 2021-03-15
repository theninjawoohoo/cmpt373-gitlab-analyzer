import { Body, Controller, Post } from '@nestjs/common';
import { RepositoryService } from 'src/gitlab/repository/repository.service';
import { MergeRequestService } from '../gitlab/merge-request/merge-request.service';
import { CommitService } from '../gitlab/repository/commit/commit.service';
import { ScoringConfig } from './scoring-config/scoring-config.entity';
import { ScoringConfigService } from './scoring-config/scoring-config.service';
import { UpdateScoringPayload } from './scoring.payloads';

@Controller('scoring')
export class ScoringController {
  constructor(
    private readonly mergeRequestService: MergeRequestService,
    private readonly commitService: CommitService,
    private readonly repositoryService: RepositoryService,
    private readonly scoringConfigService: ScoringConfigService,
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
      ),
      this.commitService.updateCommitScoreByRepository(config.repositoryId),
    ]);
    await this.repositoryService.updateScoringConfig(repository, {
      config: scoringConfig?.resource,
      id: config.scoringConfigId,
      lastRan: new Date().toISOString(),
    });
  }
}
