import { GlobWeight, ScoreOverride, StagedScoreOverride } from '@ceres/types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

class GlobWeightShape implements GlobWeight {
  @IsString()
  glob: string;

  @IsNumber()
  weight: number;
}

export class UpdateScoringPayload {
  @IsUUID()
  repositoryId: string;

  @IsUUID()
  @IsOptional()
  scoringConfigId?: string;

  @IsArray()
  @Type(() => GlobWeightShape)
  @IsOptional()
  overrides?: GlobWeightShape[];
}

class UserShape {
  @IsUUID()
  id: string;

  @IsString()
  display: string;
}

class ScoreOverrideShape implements ScoreOverride {
  @IsNumber()
  @IsOptional()
  score?: number;

  @IsBoolean()
  @IsOptional()
  exclude?: boolean;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsObject()
  @Type(() => UserShape)
  @IsOptional()
  user?: UserShape;
}

class StagedScoreOverrideShape implements StagedScoreOverride {
  @IsString()
  id: string;

  @IsString()
  display: string;

  @IsNumber()
  previousScore: number;

  @IsNumber()
  defaultScore: number;

  @IsObject()
  @Type(() => ScoreOverrideShape)
  override: ScoreOverride;
}

export class UpdateScoreOverridesPayload {
  @IsUUID()
  repositoryId: string;

  @IsArray()
  @Type(() => StagedScoreOverrideShape)
  overrides: StagedScoreOverride[];
}
