import { IsOptional, IsString, IsUUID } from 'class-validator';
import { QueryDto } from '../../../common/query-dto';

export class MergeRequestNoteQueryDto extends QueryDto {
  @IsOptional()
  @IsUUID()
  merge_request?: string;

  @IsOptional()
  @IsUUID()
  repository?: string;

  @IsOptional()
  @IsString({ each: true })
  author_email?: string;
}
