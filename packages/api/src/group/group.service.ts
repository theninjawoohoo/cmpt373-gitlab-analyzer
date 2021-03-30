import { Injectable } from '@nestjs/common';
import { BaseService } from '../common/base.service';
import { GroupDto } from './group.dto';
import { GroupConfig } from '@ceres/types';
import { GroupConfig as GroupConfigEntity } from './group.entity';
import { WithUser } from 'src/common/query-dto';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GroupService extends BaseService<
  GroupConfig,
  GroupConfigEntity,
  WithUser<GroupDto>
> {
  constructor(
    @InjectRepository(GroupConfigEntity)
    serviceRepository: Repository<GroupConfigEntity>,
  ) {
    super(serviceRepository, 'group_config');
  }

  buildFilters(
    query: SelectQueryBuilder<GroupConfigEntity>,
    filters: WithUser<GroupDto>,
  ): SelectQueryBuilder<GroupConfigEntity> {
    query = query.andWhere(`${this.tableName}.user_id = :userId`, {
      userId: filters.user.id,
    });
    return query;
  }

  buildSort(
    query: SelectQueryBuilder<GroupConfigEntity>,
  ): SelectQueryBuilder<GroupConfigEntity> {
    query = query.orderBy(`${this.tableName}.updated_at`, 'DESC');
    return query;
  }
}
