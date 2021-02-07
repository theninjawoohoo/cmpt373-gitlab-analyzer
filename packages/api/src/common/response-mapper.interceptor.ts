import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseEntity } from './base-entity';

@Injectable()
export class ResponseMapper implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(mapResponse));
  }
}

function mapResponse(data: any) {
  if (!data) {
    return data;
  }
  if (Array.isArray(data)) {
    if (data[0] && data[0] instanceof BaseEntity) {
      return (data as BaseEntity<any>[]).map(mapResourceEntity);
    }
  } else if (data instanceof BaseEntity) {
    return mapResourceEntity(data);
  }
  return data;
}

function mapResourceEntity(entity: BaseEntity<any>) {
  return {
    meta: {
      id: entity.id,
      resourceType: (entity as any)?.constructor?.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    },
    ...entity.resource,
  };
}
