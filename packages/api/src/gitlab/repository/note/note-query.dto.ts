import { IsDateString, IsOptional, IsUUID } from 'class-validator';
import { QueryDto } from '../../../common/query-dto';

export class NoteQueryDto extends QueryDto {
  @IsOptional()
  @IsUUID()
  merge_request?: string;

  @IsOptional()
  @IsUUID()
  issue?: string;

  @IsOptional()
  author_email?: string;

  @IsOptional()
  @IsDateString()
  created_start_date?: string;

  @IsOptional()
  @IsDateString()
  created_end_date?: string;

  @IsOptional()
  @IsUUID()
  repository_id?: string;
}
