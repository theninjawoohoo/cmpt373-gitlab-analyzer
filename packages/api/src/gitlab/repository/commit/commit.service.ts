import { Commit, Extensions, GlobWeight } from '@ceres/types';
import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { Repository as TypeORMCommit, SelectQueryBuilder } from 'typeorm';
import alwaysArray from '../../../common/alwaysArray';
import { DiffService } from '../diff/diff.service';
import { Repository } from '../repository.entity';
import { CommitQueryDto } from './commit-query.dto';
import { Commit as CommitEntity } from './commit.entity';
import { BaseService } from 'src/common/base.service';

@Injectable()
export class CommitService extends BaseService<
  Commit,
  CommitEntity,
  CommitQueryDto
> {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(CommitEntity)
    serviceRepository: TypeORMCommit<CommitEntity>,
    private readonly diffService: DiffService,
  ) {
    super(serviceRepository, 'commit');
  }

  buildFilters(
    query: SelectQueryBuilder<CommitEntity>,
    filters: CommitQueryDto,
  ): SelectQueryBuilder<CommitEntity> {
    query.andWhere("jsonb_array_length(commit.resource #> '{parent_ids}') < 2");
    // Only merge commits have more than one parent
    if (filters.repository) {
      query.andWhere('commit.repository_id = :repository', {
        repository: filters.repository,
      });
    }

    if (filters.merge_request) {
      query.leftJoinAndSelect('commit.mergeRequests', 'merge_request');
      query.andWhere('merge_request.id = :merge_request', {
        merge_request: filters.merge_request,
      });
    }

    if (filters.author_email) {
      query.andWhere(
        "commit.resource #>> '{author_email}' IN (:...authorEmail)",
        {
          authorEmail: alwaysArray(filters.author_email),
        },
      );
    }

    if (filters.start_date) {
      query.andWhere(
        "(commit.resource #>> '{authored_date}') >= (:startDate)",
        {
          startDate: filters.start_date,
        },
      );
    }

    if (filters.end_date) {
      query.andWhere("(commit.resource #>> '{authored_date}') <= (:endDate)", {
        endDate: filters.end_date,
      });
    }
    return query;
  }

  buildSort(
    query: SelectQueryBuilder<CommitEntity>,
    sortKey = 'authored_date',
    order: 'ASC' | 'DESC' = 'DESC',
  ): SelectQueryBuilder<CommitEntity> {
    switch (sortKey) {
      case 'authored_date':
        return query.orderBy("commit.resource #>> '{authored_date}'", order);
    }
    return query;
  }

  async findAllForRepository(repository: Repository) {
    return this.serviceRepository.find({
      where: { repository: repository },
    });
  }

  async createDailyCache(repository: Repository): Promise<Commit.DailyCount[]> {
    const rows = await this.serviceRepository
      .createQueryBuilder('commit')
      .select("commit.resource #>>'{author_email}'", 'author_email')
      .addSelect("DATE(commit.resource #>>'{created_at}')", 'date')
      .addSelect("commit.resource #>>'{author_name}'", 'author_name')
      .addSelect('count(*)', 'count')
      .addSelect(
        "sum((commit.resource #>> '{extensions,score}')::float)",
        'total_score',
      )
      .where('commit.repository_id = :repositoryId', {
        repositoryId: repository.id,
      })
      .groupBy('author_email')
      .addGroupBy('author_name')
      .addGroupBy('date')
      .getRawMany();
    return rows.map((row) => ({ ...row, count: parseInt(row.count) }));
  }

  async getDistinctAuthors(repository: Repository) {
    const rows = await this.serviceRepository
      .createQueryBuilder('commit')
      .select("commit.resource #>>'{author_email}'", 'author_email')
      .addSelect("commit.resource #>>'{author_name}'", 'author_name')
      .distinct(true)
      .where('commit.repository_id = :repositoryId', {
        repositoryId: repository.id,
      })
      .getRawMany();
    return rows as Commit.Author[];
  }

  async fetchForRepository(repository: Repository, token: string) {
    let commits: Commit[] = [];
    let page = 1;
    do {
      commits = await this.fetchByPage(token, repository, page);
      await this.syncForRepositoryPage(token, repository, commits);
      page++;
    } while (commits.length > 0);
  }

  async syncForRepositoryPage(
    token: string,
    repository: Repository,
    commits: Commit[],
  ): Promise<void> {
    const { created } = await this.createIfNotExists(repository, commits);
    await Promise.all(
      created
        .map((commit) => ({ ...commit, repository }))
        .map((commit) => this.diffService.syncForCommit(commit, token)),
    );
  }

  async getTotalForRepository(token: string, repository: Repository) {
    const axiosResponse = await this.fetchFromGitlab(token, repository, 0, 1);
    console.log(axiosResponse.headers);
    return parseInt(axiosResponse.headers['X-Total']);
  }

  async fetchByPage(
    token: string,
    repo: Repository,
    page: number,
  ): Promise<Commit[]> {
    const axiosResponse = await this.fetchFromGitlab(token, repo, page);
    return axiosResponse.data;
  }

  async findByGitlabId(repository: Repository, id: string) {
    return this.serviceRepository
      .createQueryBuilder()
      .where('repository_id = :repositoryId', { repositoryId: repository.id })
      .andWhere('resource @> :resource', { resource: { id } })
      .getOne();
  }

  private async fetchFromGitlab(
    token: string,
    repo: Repository,
    page: number,
    pageSize = 10,
  ): Promise<AxiosResponse<Commit[]>> {
    let axiosResponse: AxiosResponse<Commit[]>;
    let attemptsCount = 0;
    while (!axiosResponse && attemptsCount < 5) {
      try {
        axiosResponse = await this.httpService
          .get<Commit[]>(`projects/${repo.resource.id}/repository/commits`, {
            headers: {
              'PRIVATE-TOKEN': token,
            },
            params: {
              per_page: pageSize,
              page,
              ref_name: 'master',
            },
          })
          .toPromise();
      } catch {}
      attemptsCount++;
    }
    if (!axiosResponse) {
      throw new Error('Could not fetch commits from GitLab');
    }
    return axiosResponse;
  }

  private async createIfNotExists(repository: Repository, commits: Commit[]) {
    const entities = await Promise.all(
      commits.map(async (commit) => {
        const found = await this.serviceRepository
          .createQueryBuilder()
          .where('resource @> :resource', {
            resource: {
              id: commit.id,
            },
          })
          .andWhere('repository_id = :repositoryId', {
            repositoryId: repository.id,
          })
          .getOne();
        if (found) {
          return { commit: found, created: false };
        }
        return {
          commit: this.serviceRepository.create({
            repository: repository,
            resource: commit,
          }),
          created: true,
        };
      }),
    );
    return {
      existing: entities
        .filter(({ created }) => !created)
        .map(({ commit }) => commit),
      created: await this.serviceRepository.save(
        entities.filter(({ created }) => created).map(({ commit }) => commit),
      ),
    };
  }

  async storeScore(commit: CommitEntity, weights?: GlobWeight[]) {
    const {
      score,
      hasOverride: diffHasOverride,
    } = await this.diffService.calculateDiffScore(
      {
        commit: commit.id,
      },
      weights,
    );
    commit.resource = Extensions.updateExtensions(commit.resource, {
      score,
      diffHasOverride,
    });
    commit.score = score;
    await this.serviceRepository.save(commit);
  }

  async updateCommitScoreByRepository(
    repositoryId: string,
    weights?: GlobWeight[],
  ) {
    const [commits] = await this.search({
      repository: repositoryId,
      pageSize: 500000,
    });
    await Promise.all(
      commits.map(async (commit) => {
        await this.storeScore(commit, weights);
      }),
    );
  }
}
