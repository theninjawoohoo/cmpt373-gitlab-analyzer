import { Operation } from '@ceres/types';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { QueryDto } from '../../common/query-dto';

export class OperationQueryDto extends QueryDto {
  @IsOptional()
  @IsString({ each: true })
  subscriber?: string[];

  @IsOptional()
  @IsEnum(Operation.Type, { each: true })
  type?: Operation.Type[];

  @IsOptional()
  @IsEnum(Operation.Status, { each: true })
  status?: Operation.Status[];
}
