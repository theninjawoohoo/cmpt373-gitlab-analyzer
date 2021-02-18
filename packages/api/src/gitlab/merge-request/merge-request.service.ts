import { MergeRequest } from '@ceres/types';
import { DiffService } from '../repository/diff/diff.service';
import { MergeRequest as MergeRequestEntity } from './merge-request.entity';
import { Repository } from '../repository/repository.entity';
import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMRepository } from 'typeorm';

@Injectable()
export class MergeRequestService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(MergeRequestEntity)
    private readonly repository: TypeORMRepository<MergeRequestEntity>,
    private readonly diffService: DiffService,
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
    let mergeRequests: MergeRequest[] = [];
    let page = 1;
    do {
      mergeRequests = await this.fetchByPage(token, page, repository);
      const { created } = await this.createIfNotExists(
        repository,
        mergeRequests,
      );
      await Promise.all(
        created
          .map((mergeRequest) => ({ ...mergeRequest, repository }))
          .map((mergeRequest) =>
            this.diffService.syncForMergeRequest(mergeRequest, token),
          ),
      );
      page++;
    } while (mergeRequests.length > 0);
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

  private async fetchByPage(
    token: string,
    page: number,
    repo: Repository,
  ): Promise<MergeRequest[]> {
    const axiosResponse = await this.httpService
      .get<MergeRequest[]>(`projects/${repo.resource.id}/merge_requests`, {
        headers: {
          'PRIVATE-TOKEN': token,
        },
        params: {
          state: 'merged',
          target_branch: 'master',
          per_page: 10,
          page,
        },
      })
      .toPromise();
    return axiosResponse.data;
  }
}
