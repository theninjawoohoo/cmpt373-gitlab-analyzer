import { Commit } from '@ceres/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMRepository } from 'typeorm';
import { RepositoryMember } from '../../repository-member/repository-member.entity';
import { Repository } from '../../repository.entity';
import { CommitAuthor } from './commit-author.entity';

@Injectable()
export class CommitAuthorService {
  constructor(
    @InjectRepository(CommitAuthor)
    private readonly repository: TypeORMRepository<CommitAuthor>,
  ) {}

  create(
    author: Commit.Author,
    repository: Repository,
    repositoryMember?: RepositoryMember,
  ) {
    const entity = this.repository.create({
      resource: author,
      repository: repository,
      owner: repositoryMember,
    });
    return this.repository.save(entity);
  }

  findAllForRepository(repository: Repository) {
    return this.repository.find({
      where: {
        repository,
      },
    });
  }

  findByDetails(resource: Commit.Author) {
    return this.repository
      .createQueryBuilder()
      .where('resource @> :resource', { resource })
      .getOne();
  }
}
