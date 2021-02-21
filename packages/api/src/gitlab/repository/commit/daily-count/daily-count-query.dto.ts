import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
import { QueryDto } from '../../../../common/query-dto';

export class CommitDailyCounQueryDto extends QueryDto {
  @IsUUID()
  repository: string;

  @IsOptional()
  @IsDateString()
  start_date: string;

  @IsOptional()
  @IsDateString()
  end_date: string;

  @IsOptional()
  @IsString({ each: true })
  author_email: string;
}
