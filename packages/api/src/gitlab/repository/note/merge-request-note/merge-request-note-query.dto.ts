import { IsOptional, IsUUID } from 'class-validator';
import { QueryDto } from '../../../../common/query-dto';
import { Note } from '@ceres/types';

export class MergeRequestNoteQueryDto extends QueryDto {
  @IsOptional()
  @IsUUID()
  merge_request?: string;

  @IsOptional()
  author_email: Note.Author.author_email;
}
