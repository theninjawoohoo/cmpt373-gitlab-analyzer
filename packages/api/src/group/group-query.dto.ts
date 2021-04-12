import { IsOptional, IsString } from 'class-validator';
import { QueryDto } from '../common/query-dto';

export class GroupQueryDto extends QueryDto {
  @IsOptional()
  @IsString()
  repo_id?: string;
}
