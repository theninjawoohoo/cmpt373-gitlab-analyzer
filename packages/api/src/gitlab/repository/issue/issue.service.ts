import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Issue as IssueEntity } from '../issue/issue.entity';
import { Repository as TypeORMRepository } from 'typeorm/repository/Repository';
import { Repository } from '../repository.entity';
import { Issue } from '@ceres/types';
import { AxiosResponse } from 'axios';

@Injectable()
export class IssueService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(IssueEntity)
    private readonly repository: TypeORMRepository<IssueEntity>,
  ) {}

  async findAllForRepository(repository: Repository) {
    return this.repository.find({ where: { repository } });
  }

  async findOne(id: string) {
    return this.repository.findOne({
      where: { id },
    });
  }

  async fetchForRepository(repository: Repository, token: string) {
    let issues: Issue[] = [];
    let page = 1;
    do {
      issues = await this.fetchByPage(token, repository, page);
      await this.syncForRepositoryPage(token, repository, issues);
      page++;
    } while (issues.length > 0);
  }

  async fetchByPage(
    token: string,
    repo: Repository,
    page: number,
  ): Promise<Issue[]> {
    const axiosResponse = await this.fetchFromGitlab(token, repo, page);
    return axiosResponse.data;
  }

  async syncForRepositoryPage(
    token: string,
    repository: Repository,
    issues: Issue[],
  ): Promise<void> {
    const { created } = await this.createIfNotExists(repository, issues);
    await Promise.all(created.map((issue) => ({ ...issue, repository })));
  }

  private async fetchFromGitlab(
    token: string,
    repo: Repository,
    page: number,
    pageSize = 10,
  ): Promise<AxiosResponse<Issue[]>> {
    return await this.httpService
      .get<Issue[]>(`projects/${repo.resource.id}/issues`, {
        headers: {
          'PRIVATE-TOKEN': token,
        },
        params: {
          per_page: pageSize,
          page,
        },
      })
      .toPromise();
  }

  private async createIfNotExists(repository: Repository, issues: Issue[]) {
    const entities = await Promise.all(
      issues.map(async (issue) => {
        const found = await this.repository
          .createQueryBuilder()
          .where('resource @> :resource', {
            resource: {
              id: issue.id,
            },
          })
          .andWhere('repository_id = :repositoryId', {
            repositoryId: repository.id,
          })
          .getOne();
        if (found) {
          return { issue: found, created: false };
        }
        return {
          issue: this.repository.create({
            repository: repository,
            resource: issue,
          }),
          created: true,
        };
      }),
    );
    return {
      existing: entities
        .filter(({ created }) => !created)
        .map(({ issue }) => issue),
      created: await this.repository.save(
        entities.filter(({ created }) => created).map(({ issue }) => issue),
      ),
    };
  }
}
