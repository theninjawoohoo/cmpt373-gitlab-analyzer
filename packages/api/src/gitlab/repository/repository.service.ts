import { Repository } from '@ceres/types';
import { BaseSearch, paginate, withDefaults } from '../../common/query-dto';
import { RepositoryMemberService } from './repository-member/repository-member.service';
import { Repository as RepositoryEntity } from './repository.entity';
import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMRepository } from 'typeorm';
import { User } from '../../user/entities/user.entity';

interface RepositorySearch extends BaseSearch {
  userId: string;
}

@Injectable()
export class RepositoryService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(RepositoryEntity)
    private readonly repository: TypeORMRepository<RepositoryEntity>,
    private readonly repositoryMemberService: RepositoryMemberService,
  ) {}

  async search(filters: RepositorySearch) {
    filters = withDefaults(filters);
    const { userId } = filters;
    const query = this.repository
      .createQueryBuilder('repository')
      .where('repository.user_id = :userId', { userId })
      .orderBy("repository.resource #>> '{created_at}'", 'DESC');
    paginate(query, filters);
    return query.getManyAndCount();
  }

  async findOne(id: string) {
    return this.repository.findOne({
      where: { id },
    });
  }

  async fetchForUser(user: User, token: string) {
    let repositories: Repository[] = [];
    let page = 1;
    do {
      repositories = await this.fetchByPage(token, page);
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
        let found = await this.repository
          .createQueryBuilder()
          .where('resource @> :resource', {
            resource: {
              id: repo.id,
            },
          })
          .andWhere('user_id = :userId', { userId: user.id })
          .getOne();
        if (!found) {
          found = await this.repository.create({
            user,
            resource: repo,
          });
        } else {
          found.resource = repo;
        }
        return found;
      }),
    );
    return this.repository.save(entities);
  }

  private async fetchByPage(
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
