import { Repository } from '@ceres/types';
import { Repository as RepositoryEntity } from './repository.entity';
import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMRepository } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class RepositoryService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(RepositoryEntity)
    private readonly repository: TypeORMRepository<RepositoryEntity>,
  ) {}

  async findAll(user: User) {
    return this.repository.find({ where: { user } });
  }

  async findOne(user: User, id: string) {
    return this.repository.findOne({
      where: { user, id },
    });
  }

  async fetchForUser(user: User, token: string) {
    const axiosResponse = await this.httpService
      .get<Repository[]>('/projects?membership=true', {
        headers: {
          'PRIVATE-TOKEN': token,
        },
      })
      .toPromise();
    return this.createOrUpdate(user, axiosResponse.data);
  }

  private async createOrUpdate(user: User, repositories: Repository[]) {
    const entities = await Promise.all(
      repositories.map(async (repo) => {
        let found = await this.repository
          .createQueryBuilder()
          .where('resource @> :resource', {
            resource: {
              id: repo.id,
            },
          })
          .andWhere('user_id = :userId', { userId: user.id })
          .getOne();
        if (!found) {
          found = await this.repository.create({
            user,
            resource: repo,
          });
        } else {
          found.resource = repo;
        }
        return found;
      }),
    );
    return this.repository.save(entities);
  }
}
