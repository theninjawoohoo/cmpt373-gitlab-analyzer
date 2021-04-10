import { HttpService, Injectable } from '@nestjs/common';
import { ScoringConfig as ScoringConfigEntity } from './scoring-config.entity';
import { ScoringConfig } from '@ceres/types';
import { BaseService } from '../../common/base.service';
import { ScoringConfigDto } from './scoring-config.dto';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WithUser } from 'src/common/query-dto';

@Injectable()
export class ScoringConfigService extends BaseService<
  ScoringConfig,
  ScoringConfigEntity,
  WithUser<ScoringConfigDto>
> {
  constructor(
    @InjectRepository(ScoringConfigEntity)
    serviceRepository: Repository<ScoringConfigEntity>,
    readonly httpService: HttpService,
  ) {
    super(serviceRepository, 'scoring_config', httpService);
  }

  buildFilters(
    query: SelectQueryBuilder<ScoringConfigEntity>,
    filters: WithUser<ScoringConfigDto>,
  ): SelectQueryBuilder<ScoringConfigEntity> {
    query = query.andWhere(`${this.tableName}.user_id = :userId`, {
      userId: filters.user.id,
    });
    return query;
  }

  buildSort(
    query: SelectQueryBuilder<ScoringConfigEntity>,
  ): SelectQueryBuilder<ScoringConfigEntity> {
    query = query.orderBy(`${this.tableName}.updated_at`, 'DESC');
    return query;
  }
}
