import { HttpService, Injectable } from '@nestjs/common';
import { BaseService } from '../common/base.service';
import { GroupConfig } from '@ceres/types';
import { GroupConfig as GroupConfigEntity } from './group.entity';
import { GroupQueryDto } from './group-query.dto';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WithUser } from 'src/common/query-dto';

@Injectable()
export class GroupService extends BaseService<
  GroupConfig,
  GroupConfigEntity,
  WithUser<GroupQueryDto>
> {
  constructor(
    @InjectRepository(GroupConfigEntity)
    serviceRepository: Repository<GroupConfigEntity>,
    readonly httpService: HttpService,
  ) {
    super(serviceRepository, 'group_config', httpService);
  }

  buildFilters(
    query: SelectQueryBuilder<GroupConfigEntity>,
    filters: WithUser<GroupQueryDto>,
  ): SelectQueryBuilder<GroupConfigEntity> {
    if (filters.repo_id) {
      query = query.andWhere(`${this.tableName}.resource @> :repository`, {
        repository: { repositories: [{ id: filters.repo_id }] },
      });
    }

    return query;
  }

  buildSort(
    query: SelectQueryBuilder<GroupConfigEntity>,
  ): SelectQueryBuilder<GroupConfigEntity> {
    query = query.orderBy(`${this.tableName}.updated_at`, 'DESC');
    return query;
  }

  async findAllIterationsForRepository(repositoryId: string) {}
}
