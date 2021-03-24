import { Commit } from '@ceres/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import alwaysArray from '../../../../common/alwaysArray';
import { paginate, withDefaults } from '../../../../common/query-dto';
import { CommitDailyCountQueryDto } from './daily-count-query.dto';
import { CommitDailyCount } from './daily-count.entity';

@Injectable()
export class CommitDailyCountService {
  constructor(
    @InjectRepository(CommitDailyCount)
    private readonly repository: Repository<CommitDailyCount>,
  ) {}

  search(filters: CommitDailyCountQueryDto) {
    filters = withDefaults(filters);
    const query = this.repository.createQueryBuilder('daily_count');

    query.andWhere('repository_id = :repositoryId', {
      repositoryId: filters.repository,
    });

    if (filters.author_email) {
      query.andWhere(
        "daily_count.resource #>> '{author_email}' IN (:...authorEmail)",
        {
          authorEmail: alwaysArray(filters.author_email),
        },
      );
    }

    if (filters.start_date) {
      query.andWhere("(daily_count.resource #>> '{date}') >= (:startDate)", {
        startDate: filters.start_date,
      });
    }

    if (filters.end_date) {
      query.andWhere("(daily_count.resource #>> '{date}') <= (:endDate)", {
        endDate: filters.end_date,
      });
    }

    query.orderBy("daily_count.resource #>> '{created_at}'");
    paginate(query, filters);
    return query.getManyAndCount();
  }

  createAll(dailyCounts: Commit.DailyCount[], repositoryId: string) {
    const entities = this.repository.create(
      dailyCounts.map((resource) => ({
        resource,
        repositoryId,
      })),
    );
    return this.repository.save(entities);
  }

  clear(repositoryId: string) {
    return this.repository.delete({ repositoryId });
  }
}
