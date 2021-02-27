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

  async updateRepositoryMember(
    author: CommitAuthor,
    repositoryMember?: RepositoryMember,
  ) {
    const entity = await this.repository.preload(author);
    entity.owner = repositoryMember;
    entity.resource.repository_member_id = repositoryMember?.id;
    return this.repository.save(entity);
  }

  findAllForRepository(repository: Repository) {
    return this.repository
      .createQueryBuilder('commit_author')
      .where('commit_author.repository_id = :repository', {
        repository: repository.id,
      })
      .orderBy(
        "commit_author.resource #>> '{author_name}'",
        'ASC',
        'NULLS FIRST',
      )
      .getMany();
  }

  findOne(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  findByDetails(resource: Commit.Author, repository: Repository) {
    return this.repository
      .createQueryBuilder()
      .where('resource @> :resource', { resource })
      .andWhere('repository_id = :repository', { repository: repository.id })
      .getOne();
  }
}
