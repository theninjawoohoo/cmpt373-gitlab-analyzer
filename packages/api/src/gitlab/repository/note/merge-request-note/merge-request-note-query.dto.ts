import { IsOptional, IsUUID } from 'class-validator';
import { QueryDto } from '../../../../common/query-dto';

export class MergeRequestNoteQueryDto extends QueryDto {
  @IsOptional()
  @IsUUID()
  merge_request?: string;

  @IsOptional()
  author_email: string;
}
