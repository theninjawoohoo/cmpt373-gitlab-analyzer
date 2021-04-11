import { IsOptional, IsString, IsUUID } from 'class-validator';
import { QueryDto } from '../../../common/query-dto';

export class IssueQueryDto extends QueryDto {
  @IsUUID()
  repository: string;

  @IsOptional()
  @IsString({ each: true })
  author_email?: string[];

  @IsOptional()
  @IsUUID()
  note_id?: string;
}
