import { IsOptional, IsPositive } from 'class-validator';
import { User } from '../user/entities/user.entity';

export class QueryDto implements BaseSearch {
  @IsOptional()
  @IsPositive()
  pageSize?: number;

  @IsOptional()
  @IsPositive()
  page?: number;
}

export interface BaseSearch {
  pageSize?: number;
  page?: number;
}

export type WithUser<T> = T & {
  user: User;
};

export function withDefaults<T extends BaseSearch>(query: T): T {
  return {
    ...query,
    page: query.page || 0,
    pageSize: query.pageSize || 10,
  };
}
