import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Commit, Commit as CommitEntity } from './commit.entity';
import { Repository as TypeORMCommit } from 'typeorm';
import { Repository } from '../repository.entity';

@Injectable()
export class CommitService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(CommitEntity)
    private readonly commitRepository: TypeORMCommit<CommitEntity>,
  ) {}

  async syncForRepository(repository: Repository, token: string) {
    const commits = await this.fetchForRepository(repository, token);
    return this.createOrUpdate(commits, repository);
  }

  async findAllForRepository(repository: Repository) {
    return this.commitRepository.find({
      where: { repository: repository },
    });
  }

  private async createOrUpdate(commits: Commit[], repository: Repository) {
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
          // TODO: not sure how to fix the line below...
          found.resource = commit;
        }
        return found;
      }),
    );
    return this.commitRepository.save(entities);
  }

  private async fetchForRepository(repository: Repository, token: string) {
    const url = `/projects/${repository.resource.id}/repository/commits`;
    const axiosResponse = await this.httpService
      .get<Commit[]>(url, {
        headers: {
          'PRIVATE-TOKEN': token,
        },
        params: {
          per_page: 50,
        },
      })
      .toPromise();
    return axiosResponse.data;
  }
}
