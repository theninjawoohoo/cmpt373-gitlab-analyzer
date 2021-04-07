import { Commit, Extensions, GlobWeight, MergeRequest } from '@ceres/types';
import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import alwaysArray from 'src/common/alwaysArray';
import { Repository as TypeORMRepository, SelectQueryBuilder } from 'typeorm';
import { CommitService } from '../repository/commit/commit.service';
import { DiffService } from '../repository/diff/diff.service';
import { Repository } from '../repository/repository.entity';
import { MergeRequestParticipantService } from './merge-request-participant/merge-request-participant.service';
import { MergeRequestQueryDto } from './merge-request-query.dto';
import { MergeRequest as MergeRequestEntity } from './merge-request.entity';
import { NoteService } from '../repository/note/note.service';
import { BaseService } from 'src/common/base.service';

@Injectable()
export class MergeRequestService extends BaseService<
  MergeRequest,
  MergeRequestEntity,
  MergeRequestQueryDto
> {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(MergeRequestEntity)
    serviceRepository: TypeORMRepository<MergeRequestEntity>,
    private readonly diffService: DiffService,
    private readonly commitService: CommitService,
    private readonly participantService: MergeRequestParticipantService,
    private readonly noteService: NoteService,
  ) {
    super(serviceRepository, 'merge_request');
  }

  buildFilters(
    query: SelectQueryBuilder<MergeRequestEntity>,
    filters: MergeRequestQueryDto,
  ): SelectQueryBuilder<MergeRequestEntity> {
    const { repository } = filters;
    query.andWhere('merge_request.repository_id = :repository', { repository });

    if (filters.author_email) {
      query.andWhere(
        `
          merge_request.id IN  (
            SELECT "mrc"."mergeRequestId"
            FROM merge_request_commits_commit mrc
            INNER JOIN (
              SELECT * FROM commit
              WHERE commit.resource #>> '{author_email}' IN (:...authorEmail)
            ) c ON c.id = "mrc"."commitId"
          )
        `,
        { authorEmail: alwaysArray(filters.author_email) },
      );
    }

    if (filters.merged_start_date) {
      query.andWhere(
        "(merge_request.resource #>> '{merged_at}') >= (:startDate)",
        {
          startDate: filters.merged_start_date,
        },
      );
    }

    if (filters.merged_end_date) {
      query.andWhere(
        "(merge_request.resource #>> '{merged_at}') <= (:endDate)",
        {
          endDate: filters.merged_end_date,
        },
      );
    }
    if (filters.only_with_notes) {
      query.andWhere(`
      merge_request.id IN  (
        SELECT merge_request.resource" #>> '{id}'
        FROM merge_request 
        INNER JOIN (
          SELECT * FROM note
        ) c ON c.merge_request_id = merge_request.resource #>> '{id}'
      )
    `);
    }
    return query;
  }

  buildSort(
    query: SelectQueryBuilder<MergeRequestEntity>,
  ): SelectQueryBuilder<MergeRequestEntity> {
    return query.orderBy("merge_request.resource #>> '{merged_at}'", 'DESC');
  }

  async buildDailyCounts(
    filters: MergeRequestQueryDto,
  ): Promise<MergeRequest.DailyCount[]> {
    let query = this.serviceRepository.createQueryBuilder('merge_request');
    query = this.buildFilters(query, filters);
    query.select("DATE(merge_request.resource #>>'{merged_at}')", 'date');
    query.addSelect('count(*)::integer', 'count');
    query.addSelect(
      "sum((merge_request.resource #>> '{extensions,diffScore}')::float)",
      'score',
    );
    query.groupBy('date');
    query.orderBy('date', 'ASC');
    return query.getRawMany<MergeRequest.DailyCount>();
  }

  async fetchAllParticipantsForRepository(
    repository: Repository,
    token: string,
  ) {
    const mergeRequests = await this.findAllForRepository(repository);
    return await Promise.all(
      mergeRequests.map(async (mergeRequest) => {
        return await this.participantService.syncForMergeRequest(
          mergeRequest,
          token,
        );
      }),
    );
  }

  async findAllParticipantsForRepository(repository: Repository) {
    const mergeRequests = await this.findAllForRepository(repository);
    return await Promise.all(
      mergeRequests.map(async (mergeRequest) => {
        return await this.participantService.findAllForMergeRequest(
          mergeRequest,
        );
      }),
    );
  }

  async findAllForRepository(repository: Repository) {
    return this.serviceRepository.find({ where: { repository } });
  }

  async findOne(id: string) {
    return this.serviceRepository.findOne({
      where: { id },
    });
  }

  async fetchForRepository(repository: Repository, token: string) {
    let mergeRequests: MergeRequest[] = [];
    let page = 1;
    do {
      mergeRequests = await this.fetchByPage(token, repository, page);
      await this.syncForRepositoryPage(token, repository, mergeRequests);
      page++;
    } while (mergeRequests.length > 0);
  }

  async linkCommitsForRepository(token: string, repository: Repository) {
    let page = 0;
    let mergeRequests = [];
    do {
      mergeRequests = await this.serviceRepository.find({
        where: { repository },
        take: 10,
        skip: page,
        order: { id: 'ASC' },
      });
      await Promise.all(
        mergeRequests.map((mergeRequest) =>
          this.linkCommitsForMergeRequest(token, repository, mergeRequest),
        ),
      );
      page++;
    } while (mergeRequests.length > 0);
  }

  private async linkCommitsForMergeRequest(
    token: string,
    repository: Repository,
    mergeRequest: MergeRequestEntity,
  ) {
    const commits = await this.fetchCommitsFromGitlab(
      token,
      repository,
      mergeRequest.resource,
    );
    mergeRequest.commits = await Promise.all(
      commits.map((commit) =>
        this.commitService.findByGitlabId(repository, commit.id),
      ),
    );
    await this.serviceRepository.save(mergeRequest);
  }

  async syncForRepositoryPage(
    token: string,
    repository: Repository,
    mergeRequests: MergeRequest[],
  ): Promise<void> {
    const { created } = await this.createIfNotExists(repository, mergeRequests);
    await Promise.all(
      created
        .map((mergeRequest) => ({ ...mergeRequest, repository }))
        .map((mergeRequest) =>
          this.diffService.syncForMergeRequest(mergeRequest, token),
        ),
    );
    await Promise.all(
      created.map((mergeRequest) =>
        this.noteService.syncForMergeRequest(mergeRequest, token),
      ),
    );
  }

  private async createIfNotExists(
    repository: Repository,
    mergeRequests: MergeRequest[],
  ) {
    const entities = await Promise.all(
      mergeRequests.map(async (mergeRequest) => {
        const found = await this.serviceRepository
          .createQueryBuilder()
          .where('resource @> :resource', {
            resource: {
              id: mergeRequest.id,
            },
          })
          .andWhere('repository_id = :repositoryId', {
            repositoryId: repository.id,
          })
          .getOne();
        if (found) {
          return { mergeRequest: found, created: false };
        }
        return {
          mergeRequest: this.serviceRepository.create({
            repository: repository,
            resource: mergeRequest,
          }),
          created: true,
        };
      }),
    );
    return {
      existing: entities
        .filter(({ created }) => !created)
        .map(({ mergeRequest }) => mergeRequest),
      created: await this.serviceRepository.save(
        entities
          .filter(({ created }) => created)
          .map(({ mergeRequest }) => mergeRequest),
      ),
    };
  }

  async getTotalForRepository(token: string, repository: Repository) {
    const axiosResponse = await this.fetchFromGitlab(token, repository, 0, 1);
    return parseInt(axiosResponse.headers['X-Total']);
  }

  async fetchByPage(
    token: string,
    repo: Repository,
    page: number,
  ): Promise<MergeRequest[]> {
    const axiosResponse = await this.fetchFromGitlab(token, repo, page);
    return axiosResponse.data;
  }

  async fetchCommitsFromGitlab(
    token: string,
    repository: Repository,
    mergeRequest: MergeRequest,
  ) {
    const axiosResponse = await this.httpService
      .get<Commit[]>(
        `projects/${repository.resource.id}/merge_requests/${mergeRequest.iid}/commits`,
        {
          headers: {
            'PRIVATE-TOKEN': token,
          },
        },
      )
      .toPromise();
    return axiosResponse.data;
  }

  private async fetchFromGitlab(
    token: string,
    repo: Repository,
    page: number,
    pageSize = 10,
  ): Promise<AxiosResponse<MergeRequest[]>> {
    return await this.httpService
      .get<MergeRequest[]>(`projects/${repo.resource.id}/merge_requests`, {
        headers: {
          'PRIVATE-TOKEN': token,
        },
        params: {
          state: 'merged',
          target_branch: 'master',
          per_page: pageSize,
          page,
        },
      })
      .toPromise();
  }

  public async getSumScoreForMergeRequest(
    mergeRequest: MergeRequestEntity,
    weights?: GlobWeight[],
  ) {
    const [commits] = await this.commitService.search({
      merge_request: mergeRequest.id,
      pageSize: 50000,
    });
    const scores = await Promise.all(
      commits.map(async (commit) => {
        return this.diffService.calculateDiffScore(
          {
            commit: commit.id,
          },
          weights,
        );
      }),
    );

    return scores.reduce((a, b) => a + b, 0);
  }

  async storeScore(mergeRequest: MergeRequestEntity, weights?: GlobWeight[]) {
    const score = await this.diffService.calculateDiffScore(
      {
        merge_request: mergeRequest.id,
      },
      weights,
    );
    const sumScore = await this.getSumScoreForMergeRequest(
      mergeRequest,
      weights,
    );
    mergeRequest.resource = Extensions.updateExtensions(mergeRequest.resource, {
      diffScore: score,
      commitScoreSum: sumScore,
    });
    mergeRequest.diffScore = score;
    mergeRequest.commitScoreSum = sumScore;
    await this.serviceRepository.save(mergeRequest);
  }

  async updateMergeRequestScoreByRepository(
    repositoryId: string,
    weights?: GlobWeight[],
  ) {
    const [mergeRequests] = await this.search({
      repository: repositoryId,
      pageSize: 500000,
    });
    await Promise.all(
      mergeRequests.map(async (mergeRequest) => {
        await this.storeScore(mergeRequest, weights);
      }),
    );
  }
}
