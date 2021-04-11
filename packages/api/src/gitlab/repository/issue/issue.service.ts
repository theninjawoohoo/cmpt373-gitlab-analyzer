import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Issue as IssueEntity } from '../issue/issue.entity';
import { Repository as TypeORMRepository } from 'typeorm/repository/Repository';
import { Repository } from '../repository.entity';
import { Issue } from '@ceres/types';
import { AxiosResponse } from 'axios';
import { NoteService } from '../note/note.service';
import { IssueQueryDto } from './issue-query.dto';
import { SelectQueryBuilder } from 'typeorm';
import { BaseService } from '../../../common/base.service';

@Injectable()
export class IssueService extends BaseService<
  Issue,
  IssueEntity,
  IssueQueryDto
> {
  constructor(
    readonly httpService: HttpService,
    @InjectRepository(IssueEntity)
    serviceRepository: TypeORMRepository<IssueEntity>,
    private readonly noteService: NoteService,
  ) {
    super(serviceRepository, 'issue', httpService);
  }

  buildFilters(
    query: SelectQueryBuilder<IssueEntity>,
    filters: IssueQueryDto,
  ): SelectQueryBuilder<IssueEntity> {
    const { repository } = filters;
    query.andWhere('issue.repository_id = :repository', { repository });

    if (filters.note_id) {
      query.andWhere(
        'issue.id in (select issue_id from note where id = :note_id)',
        {
          note_id: filters.note_id,
        },
      );
    }
    return query;
  }

  buildSort(
    query: SelectQueryBuilder<IssueEntity>,
  ): SelectQueryBuilder<IssueEntity> {
    return query.orderBy("issue.resource #>> '{created_at}'", 'DESC');
  }

  async findAllForRepository(repository: Repository) {
    return this.serviceRepository.find({ where: { repository } });
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
    const { created } = await this.createAndSaveIssues(repository, issues);
    await Promise.all(created.map((issue) => ({ ...issue, repository })));
    await Promise.all(
      created.map((issue) => this.noteService.syncForIssue(issue, token)),
    );
  }

  private async fetchFromGitlab(
    token: string,
    repo: Repository,
    page: number,
    pageSize = 10,
  ): Promise<AxiosResponse<Issue[]>> {
    const url = `projects/${repo.resource.id}/issues`;
    const params = { per_page: pageSize, page: page };
    return await this.fetchWithRetries<Issue>(token, url, params, 5);
  }

  private async createAndSaveIssues(repository: Repository, issues: Issue[]) {
    const entities = await Promise.all(
      issues.map(async (issue) => {
        return this.createIssueIfNotExists(repository, issue);
      }),
    );
    return {
      existing: entities
        .filter(({ created }) => !created)
        .map(({ issue }) => issue),
      created: await this.serviceRepository.save(
        entities.filter(({ created }) => created).map(({ issue }) => issue),
      ),
    };
  }

  private async createIssueIfNotExists(repository: Repository, issue: Issue) {
    const found = await this.queryIssueFromRepository(repository, issue);
    if (found) {
      return { issue: found, created: false };
    }
    return {
      issue: this.createNewIssue(repository, issue),
      created: true,
    };
  }

  private queryIssueFromRepository(repository: Repository, issue: Issue) {
    return this.serviceRepository
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
  }

  private createNewIssue(repository: Repository, issue: Issue) {
    return this.serviceRepository.create({
      repository: repository,
      resource: issue,
    });
  }
}
