import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
import { QueryDto } from '../../../common/query-dto';

export class CommitQueryDto extends QueryDto {
  @IsOptional()
  @IsUUID()
  merge_request?: string;

  @IsOptional()
  @IsUUID()
  repository?: string;

  @IsOptional()
  @IsString({ each: true })
  author_email?: string;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;
  
  @IsString({ each: true })
  score?: number;
}
