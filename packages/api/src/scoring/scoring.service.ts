import { Injectable } from '@nestjs/common';
import { RepositoryService } from '../gitlab/repository/repository.service';
import { MergeRequestService } from '../gitlab/merge-request/merge-request.service';
import { CommitService } from '../gitlab/repository/commit/commit.service';
import { ScoringConfig } from './scoring-config/scoring-config.entity';
import { Repository } from '../gitlab/repository/repository.entity';
import { DiffService } from '../gitlab/repository/diff/diff.service';
import { GlobWeight, StagedScoreOverride } from '@ceres/types';

@Injectable()
export class ScoringService {
  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly mergeRequestService: MergeRequestService,
    private readonly commitService: CommitService,
    private readonly diffService: DiffService,
  ) {}

  async updateRepositoryScores(
    repository: Repository,
    scoringConfig?: ScoringConfig,
    weightOverrides?: GlobWeight[],
  ) {
    const combinedWeights = [
      ...(scoringConfig?.resource?.weights || []),
      ...(weightOverrides || []),
    ];
    await Promise.all([
      this.mergeRequestService.updateMergeRequestScoreByRepository(
        repository.id,
        combinedWeights,
      ),
      this.commitService.updateCommitScoreByRepository(
        repository.id,
        combinedWeights,
      ),
    ]);
    await this.repositoryService.updateScoringConfig(repository, {
      config: scoringConfig?.resource,
      overrides: weightOverrides,
      id: scoringConfig?.id,
      lastRan: new Date().toISOString(),
    });
  }

  async updateOverrides(overrides: StagedScoreOverride[]) {
    const diffOverrides = StagedScoreOverride.getDiffOverrides(overrides);
    await Promise.all(
      diffOverrides.map((override) => {
        const { id } = StagedScoreOverride.parseEntityId(override.id);
        this.diffService.updateOverride(id, override.override);
      }),
    );
  }
}
