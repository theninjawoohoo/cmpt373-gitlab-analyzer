import { Repository } from '@ceres/types';
import { IsEnum, IsOptional } from 'class-validator';
import { QueryDto } from '../../common/query-dto';

export class RepositoryQueryDto extends QueryDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEnum(Repository.Role, { each: true })
  role?: Repository.Role[];
}
