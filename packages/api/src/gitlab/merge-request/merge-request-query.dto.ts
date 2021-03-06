import { IsOptional, IsString, IsUUID } from 'class-validator';
import { QueryDto } from '../../common/query-dto';

export class MergeRequestQueryDto extends QueryDto {
  @IsUUID()
  repository: string;

  @IsOptional()
  @IsString({ each: true })
  commit_author_email?: string;
}
