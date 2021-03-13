import { Extensions, Repository } from '@ceres/types';
import { WithUser } from '../../common/query-dto';
import { RepositoryMemberService } from './repository-member/repository-member.service';
import { Repository as RepositoryEntity } from './repository.entity';
import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMRepository, SelectQueryBuilder } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { RepositoryQueryDto } from './repository-query.dto';
import { BaseService } from 'src/common/base.service';

@Injectable()
export class RepositoryService extends BaseService<
  Repository,
  RepositoryEntity,
  WithUser<RepositoryQueryDto>
> {
  constructor(
    private readonly httpService: HttpService,
    private readonly repositoryMemberService: RepositoryMemberService,
    @InjectRepository(RepositoryEntity)
    repository: TypeORMRepository<RepositoryEntity>,
  ) {
    super(repository, 'repository');
  }

  buildFilters(
    query: SelectQueryBuilder<RepositoryEntity>,
    filters: WithUser<RepositoryQueryDto>,
  ): SelectQueryBuilder<RepositoryEntity> {
    query.andWhere('repository.user_id = :userId', { userId: filters.user.id });

    if (filters.name) {
      query.andWhere(
        "(repository.resource #>> '{name_with_namespace}') ~* ('.*' || :name || '.*')",
        {
          name: filters.name,
        },
      );
    }

    return query;
  }
  buildSort(
    query: SelectQueryBuilder<RepositoryEntity>,
    sortKey = 'project_created',
    order: 'ASC' | 'DESC' = 'DESC',
  ): SelectQueryBuilder<RepositoryEntity> {
    switch (sortKey) {
      case 'project_synced':
        return query.orderBy(
          "(repository.resource #>> '{extensions,lastSync}')::timestamptz",
          order,
          'NULLS LAST',
        );
      case 'project_created':
        return query.orderBy("jrepository.resource #>> '{created_at}'", order);
    }
    return query;
  }

  async updateLastSync(repository: RepositoryEntity, timestamp = new Date()) {
    repository.resource = Extensions.updateExtensions(repository.resource, {
      lastSync: timestamp.toISOString(),
    });
    return this.update(repository);
  }

  async fetchFromGitlabForUser(user: User, token: string) {
    let repositories: Repository[] = [];
    let page = 1;
    do {
      repositories = await this.fetchFromGitlabByPage(token, page);
      const entities = await this.createOrUpdate(user, repositories);
      await Promise.all(
        entities.map((entity) =>
          this.repositoryMemberService.syncForRepository(entity, token),
        ),
      );
      page++;
    } while (repositories.length > 0);
  }

  private async createOrUpdate(user: User, repositories: Repository[]) {
    const entities = await Promise.all(
      repositories.map(async (repo) => {
        let found = await this.serviceRepository
          .createQueryBuilder()
          .where('resource @> :resource', {
            resource: {
              id: repo.id,
            },
          })
          .andWhere('user_id = :userId', { userId: user.id })
          .getOne();
        if (!found) {
          found = this.serviceRepository.create({
            user,
            resource: repo,
          });
        } else {
          found.resource = Extensions.updateResource(found.resource, repo);
        }
        return found;
      }),
    );
    return this.serviceRepository.save(entities);
  }

  private async fetchFromGitlabByPage(
    token: string,
    page: number,
  ): Promise<Repository[]> {
    const axiosResponse = await this.httpService
      .get<Repository[]>('/projects', {
        headers: {
          'PRIVATE-TOKEN': token,
        },
        params: {
          membership: true,
          per_page: 10,
          page,
        },
      })
      .toPromise();
    return axiosResponse.data;
  }
}
