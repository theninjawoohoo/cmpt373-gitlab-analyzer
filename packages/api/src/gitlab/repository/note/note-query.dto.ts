import { IsOptional, IsUUID } from 'class-validator';
import { QueryDto } from '../../../common/query-dto';

export class NoteQueryDto extends QueryDto {
  @IsOptional()
  @IsUUID()
  merge_request?: string;

  @IsOptional()
  @IsUUID()
  issue?: string;

  @IsOptional()
  author_email: string;
}
