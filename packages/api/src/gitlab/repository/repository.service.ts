import { Extensions, Repository } from '@ceres/types';
import alwaysArray from '../../common/alwaysArray';
import { WithUser } from '../../common/query-dto';
import { RepositoryMemberService } from './repository-member/repository-member.service';
import { Repository as RepositoryEntity } from './repository.entity';
import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  Repository as TypeORMRepository,
  SelectQueryBuilder,
} from 'typeorm';
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
    // nests an OR inside and AND
    // i.e. AND ( ... OR ... ) so we can query for repositories the user owns
    // and is a collaborator in at the same time
    query.andWhere(
      new Brackets((q) => {
        alwaysArray(filters.role || [Repository.Role.owner]).forEach((role) => {
          if (role === Repository.Role.owner) {
            q.orWhere('repository.user_id = :userId', {
              userId: filters.user.id,
            });
          } else if (role === Repository.Role.collaborator) {
            // check if user is one of the collaborators
            q.orWhere(
              "repository.resource #> '{extensions}' @> :collaborators",
              {
                collaborators: { collaborators: [{ id: filters.user.id }] },
              },
            );
          }
        });
      }),
    );

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
        return query.orderBy("repository.resource #>> '{created_at}'", order);
      case 'project_name':
        return query.orderBy("repository.resource #> '{name}'", order);
    }
    return query;
  }

  async updateLastSync(repository: RepositoryEntity, timestamp = new Date()) {
    repository.resource = Extensions.updateExtensions(repository.resource, {
      lastSync: timestamp.toISOString(),
    });
    return this.update(repository);
  }

  updateScoringConfig(
    repository: RepositoryEntity,
    scoringConfig: Repository['extensions']['scoringConfig'],
  ) {
    repository.resource = Extensions.updateExtensions(repository.resource, {
      scoringConfig,
    });
    return this.update(repository);
  }

  addCollaborator(
    repository: RepositoryEntity,
    user: User,
    accessLevel: Repository.AccessLevel,
  ) {
    const collaborators = repository.resource.extensions?.collaborators || [];
    if (!collaborators.find((c) => c.id === user.id)) {
      repository.resource = Extensions.updateExtensions(repository.resource, {
        collaborators: [
          ...collaborators,
          { id: user.id, display: user.auth.userId, accessLevel },
        ],
      });
    }
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
    let entities = await Promise.all(
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
    entities = entities.map((entity) => ({
      ...entity,
      resource: Extensions.updateExtensions(entity.resource, {
        owner: { id: user.id, display: user.auth.userId },
      }),
    }));
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
