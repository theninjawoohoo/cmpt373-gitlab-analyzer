import { IsOptional, IsString, IsUUID } from 'class-validator';
import { QueryDto } from '../../common/query-dto';

export class OperationQueryDto extends QueryDto {
  @IsOptional()
  @IsString({ each: true })
  subscriber?: string[];
}
