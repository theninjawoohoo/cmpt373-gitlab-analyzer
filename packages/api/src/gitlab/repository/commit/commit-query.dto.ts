import { IsOptional, IsUUID } from 'class-validator';
import { QueryDto } from '../../../common/query-dto';

export class CommitQueryDto extends QueryDto {
  @IsOptional()
  @IsUUID()
  merge_request?: string;

  @IsOptional()
  @IsUUID()
  repository?: string;
}
