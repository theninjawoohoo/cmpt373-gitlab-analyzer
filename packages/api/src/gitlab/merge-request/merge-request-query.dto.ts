import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { QueryDto } from '../../common/query-dto';

export class MergeRequestQueryDto extends QueryDto {
  @IsUUID()
  repository: string;

  @IsOptional()
  @IsString({ each: true })
  author_email?: string[];

  @IsOptional()
  @IsDateString()
  merged_start_date?: string;

  @IsOptional()
  @IsDateString()
  merged_end_date?: string;

  @IsOptional()
  @IsBoolean()
  only_with_notes: boolean;
}
