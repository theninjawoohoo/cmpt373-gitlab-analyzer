import { MergeRequest } from '@ceres/types';
import { MergeRequest as MergeRequestEntity } from './mergeRequest.entity';
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
  ) {}

  async findAllForRepository(repository: Repository) {
    return this.repository.find({ where: { repository } });
  }

  async findOne(id: string) {
    return this.repository.findOne({
      where: { id },
    });
  }

  async fetchForRepository(repo: Repository, token: string) {
    let mergerequests: MergeRequest[] = [];
    let page = 1;
    do {
      mergerequests = await this.fetchByPage(token, page, repo);
      await this.createOrUpdate(repo, mergerequests);
      page++;
    } while (mergerequests.length > 0);
  }

  private async createOrUpdate(repo: Repository, mergerequests: MergeRequest[]) {
    const entities = await Promise.all(
      mergerequests.map(async (mr) => {
        let found = await this.repository
          .createQueryBuilder()
          .where('resource @> :resource', {
            resource: {
              id: mr.id,
            },
          })
          .andWhere('repository_id = :repoId', { repoId: repo.id })
          .getOne();
        if (!found) {
          found = await this.repository.create({
            repository: repo,
            resource: mr,
          });
        } else {
          found.resource = mr;
        }
        return found;
      }),
    );
    return this.repository.save(entities);
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
          per_page: 10,
          page,
        },
      })
      .toPromise();
    return axiosResponse.data;
  }
}
