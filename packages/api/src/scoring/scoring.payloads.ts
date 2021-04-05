import { IsOptional, IsUUID } from 'class-validator';

export class UpdateScoringPayload {
  @IsUUID()
  repositoryId: string;

  @IsUUID()
  @IsOptional()
  scoringConfigId?: string;
}
