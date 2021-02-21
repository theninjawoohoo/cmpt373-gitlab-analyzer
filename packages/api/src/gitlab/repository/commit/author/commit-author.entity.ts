import { Commit } from '@ceres/types';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../../common/base-entity';
import { RepositoryMember } from '../../repository-member/repository-member.entity';
import { Repository } from '../../repository.entity';

@Entity('commit_author')
export class CommitAuthor extends BaseEntity<Commit.Author> {
  @ManyToOne(
    () => RepositoryMember,
    (repositoryMember) => repositoryMember.authors,
  )
  @JoinColumn({ name: 'repository_member_id' })
  owner?: RepositoryMember;

  @ManyToOne(
    () => Repository,
    (repositoryMember) => repositoryMember.commitAuthors,
  )
  @JoinColumn({ name: 'repository_id' })
  repository: Repository;
}
