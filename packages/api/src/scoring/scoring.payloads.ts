import { StagedScoreOverride } from '@ceres/types';
import { IsArray, IsOptional, IsUUID } from 'class-validator';

export class UpdateScoringPayload {
  @IsUUID()
  repositoryId: string;

  @IsUUID()
  @IsOptional()
  scoringConfigId?: string;
}

export class UpdateScoreOverridesPayload {
  @IsUUID()
  repositoryId: string;

  @IsArray()
  overrides: StagedScoreOverride[];
}
