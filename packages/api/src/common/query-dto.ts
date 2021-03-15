import { IsNumber, IsOptional, Min } from 'class-validator';
import { SelectQueryBuilder } from 'typeorm';
import { User } from '../user/entities/user.entity';

export class QueryDto implements BaseSearch {
  @IsOptional()
  @IsNumber()
  @Min(0)
  pageSize?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  page?: number;

  @IsOptional()
  sort?: string;
}

export interface BaseSearch {
  pageSize?: number;
  page?: number;
}

export type WithUser<T> = T & {
  user: User;
};

export function paginate(query: SelectQueryBuilder<any>, filters: QueryDto) {
  return query.offset(filters.page * filters.pageSize).limit(filters.pageSize);
}

export function withDefaults<T extends BaseSearch>(query: T): T {
  return {
    ...query,
    page: query.page || 0,
    pageSize: query.pageSize || 10,
  };
}
