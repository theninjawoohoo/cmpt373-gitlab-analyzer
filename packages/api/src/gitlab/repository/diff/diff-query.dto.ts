import { IsOptional, IsUUID } from 'class-validator';
import { QueryDto } from '../../../common/query-dto';

export class DiffQueryDto extends QueryDto {
  @IsOptional()
  @IsUUID()
  merge_request?: string;

  @IsOptional()
  @IsUUID()
  commit?: string;
}
