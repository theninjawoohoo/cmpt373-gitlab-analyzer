import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Commit as CommitEntity } from './commit.entity';
import { Commit } from '@ceres/types';
import { Repository as TypeORMCommit } from 'typeorm';
import { Repository } from '../repository.entity';

@Injectable()
export class CommitService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(CommitEntity)
    private readonly commitRepository: TypeORMCommit<CommitEntity>,
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
      await this.createOrUpdate(repository, commits);
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

  private async createOrUpdate(repository: Repository, commits: Commit[]) {
    const entities = await Promise.all(
      commits.map(async (commit) => {
        let found = await this.commitRepository
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
        if (!found) {
          found = this.commitRepository.create({
            repository: repository,
            resource: commit,
          });
        } else {
          found.resource = commit;
        }
        return found;
      }),
    );
    return this.commitRepository.save(entities);
  }
}
