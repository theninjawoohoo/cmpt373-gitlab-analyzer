import { Commit } from '@ceres/types';
import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { Repository as TypeORMCommit } from 'typeorm';
import { DiffService } from '../diff/diff.service';
import { Repository } from '../repository.entity';
import { Commit as CommitEntity } from './commit.entity';

@Injectable()
export class CommitService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(CommitEntity)
    private readonly commitRepository: TypeORMCommit<CommitEntity>,
    private readonly diffService: DiffService,
  ) {}

  async findAllForRepository(repository: Repository) {
    return this.commitRepository.find({
      where: { repository: repository },
    });
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
    return this.commitRepository
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
    return await this.httpService
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
  }

  private async createIfNotExists(repository: Repository, commits: Commit[]) {
    const entities = await Promise.all(
      commits.map(async (commit) => {
        const found = await this.commitRepository
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
          commit: this.commitRepository.create({
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
      created: await this.commitRepository.save(
        entities.filter(({ created }) => created).map(({ commit }) => commit),
      ),
    };
  }
}
