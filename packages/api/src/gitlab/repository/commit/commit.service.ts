import { Commit } from '@ceres/types';
import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
      commits = await this.fetchByPage(token, page, repository);
      const { created } = await this.createIfNotExists(repository, commits);
      await Promise.all(
        created
          .map((commit) => ({ ...commit, repository }))
          .map((commit) => this.diffService.syncForCommit(commit, token)),
      );
      page++;
    } while (commits.length > 0);
  }

  private async fetchByPage(
    token: string,
    page: number,
    repo: Repository,
  ): Promise<Commit[]> {
    const axiosResponse = await this.httpService
      .get<Commit[]>(
        `projects/${repo.resource.id}/repository/commits?ref_name=master`,
        {
          headers: {
            'PRIVATE-TOKEN': token,
          },
          params: {
            per_page: 10,
            page,
          },
        },
      )
      .toPromise();
    return axiosResponse.data;
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
