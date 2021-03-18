import { Repository } from '@ceres/types';
import { IsEnum, IsString, IsUUID } from 'class-validator';

export class AddCollaboratorPayload {
  @IsString()
  sfuId: string;

  @IsEnum(Repository.AccessLevel)
  accessLevel: Repository.AccessLevel;
}
export class RemoveCollaboratorPayload {
  @IsUUID()
  collaboratorId: string;
}
