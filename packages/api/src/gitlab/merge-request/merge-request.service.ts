import { Commit, MergeRequest } from '@ceres/types';
import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { Repository as TypeORMRepository } from 'typeorm';
import alwaysArray from '../../common/alwaysArray';
import { BaseSearch, paginate, withDefaults } from '../../common/query-dto';
import { CommitService } from '../repository/commit/commit.service';
import { DiffService } from '../repository/diff/diff.service';
import { Repository } from '../repository/repository.entity';
import { MergeRequestParticipantService } from './merge-request-participant/merge-request-participant.service';
import { MergeRequestQueryDto } from './merge-request-query.dto';
import { MergeRequest as MergeRequestEntity } from './merge-request.entity';

@Injectable()
export class MergeRequestService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(MergeRequestEntity)
    private readonly repository: TypeORMRepository<MergeRequestEntity>,
    private readonly diffService: DiffService,
    private readonly commitService: CommitService,
    private readonly participantService: MergeRequestParticipantService,
  ) {}

  async search(filters: MergeRequestQueryDto) {
    filters = withDefaults(filters);
    const { repository } = filters;
    const query = this.repository
      .createQueryBuilder('merge_request')
      .where('merge_request.repository_id = :repository', { repository });

    if (filters.commit_author_email) {
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
        { authorEmail: alwaysArray(filters.commit_author_email) },
      );
    }

    query.orderBy("merge_request.resource #>> '{merged_at}'", 'DESC');
    paginate(query, filters);
    return query.getManyAndCount();
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
    return this.repository.find({ where: { repository } });
  }

  async findOne(id: string) {
    return this.repository.findOne({
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
      mergeRequests = await this.repository.find({
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
    await this.repository.save(mergeRequest);
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
  }

  private async createIfNotExists(
    repository: Repository,
    mergeRequests: MergeRequest[],
  ) {
    const entities = await Promise.all(
      mergeRequests.map(async (mergeRequest) => {
        const found = await this.repository
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
          mergeRequest: this.repository.create({
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
      created: await this.repository.save(
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
}
