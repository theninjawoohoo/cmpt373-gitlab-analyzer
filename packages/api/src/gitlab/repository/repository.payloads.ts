import { Repository } from '@ceres/types';
import { IsEnum, IsString } from 'class-validator';

export class AddCollaboratorPayload {
  @IsString()
  sfuId: string;

  @IsEnum(Repository.AccessLevel)
  accessLevel: Repository.AccessLevel;
}
