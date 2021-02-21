import { Operation } from '@ceres/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import alwaysArray from '../common/alwaysArray';
import { paginate, withDefaults, WithUser } from '../common/query-dto';
import { User } from '../user/entities/user.entity';
import { OperationQueryDto } from './dtos/operation-query.dto';
import { Operation as OperationEntity } from './operation.entity';

@Injectable()
export class OperationService {
  constructor(
    @InjectRepository(OperationEntity)
    private readonly operationRepository: Repository<OperationEntity>,
  ) {}

  search(filters: WithUser<OperationQueryDto>) {
    filters = withDefaults(filters);
    let query = this.operationRepository.createQueryBuilder('operation');

    if (filters.user) {
      query = query.andWhere('operation.user_id = :user', {
        user: filters.user.id,
      });
    }

    if (filters.subscriber) {
      query.andWhere(
        new Brackets((builder) => {
          alwaysArray(filters.subscriber).forEach((subscriber, index) => {
            builder = builder.orWhere(
              `operation.resource @> :subscriber${index}`,
              {
                [`subscriber${index}`]: { subscribers: [subscriber] },
              },
            );
          });
        }),
      );
    }

    if (filters.type) {
      query.andWhere("operation.resource #>> '{type}' IN (:...type)", {
        type: alwaysArray(filters.type),
      });
    }

    if (filters.status) {
      query.andWhere("operation.resource #>> '{status}' IN (:...status)", {
        status: alwaysArray(filters.status),
      });
    }

    query.orderBy('operation.created_at', 'DESC');
    paginate(query, filters);
    return query.getManyAndCount();
  }

  create(user: User, type: Operation.Type, input: any) {
    const operation = this.operationRepository.create({
      user,
      resource: {
        type,
        owner: user.id,
        status: Operation.Status.PENDING,
        stages: [],
        input,
        subscribers: this.buildSubscribers(type, input),
      },
    });
    return this.operationRepository.save(operation);
  }

  getOldestPending() {
    return this.operationRepository
      .createQueryBuilder('operation')
      .where('resource @> :resource', {
        resource: {
          status: Operation.Status.PENDING,
        },
      })
      .orderBy('created_at', 'ASC')
      .leftJoinAndSelect('operation.user', 'user')
      .getOne();
  }

  private buildSubscribers(type: Operation.Type, input: any) {
    switch (type) {
      case Operation.Type.SYNC_REPOSITORY:
        return [
          `Repository/${
            (input as Operation.SyncRepositoryPayload).repository_id
          }`,
        ];
      default:
        return [];
    }
  }
}
