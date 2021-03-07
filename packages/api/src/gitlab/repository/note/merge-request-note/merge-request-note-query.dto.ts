import { IsOptional, IsUUID } from 'class-validator';
import { QueryDto } from '../../../../common/query-dto';
// import { Note } from '@ceres/types';
// import Author = Note.Author;

export class MergeRequestNoteQueryDto extends QueryDto {
  @IsOptional()
  @IsUUID()
  merge_request?: string;

  // @IsOptional()
  // author: Author;
}
