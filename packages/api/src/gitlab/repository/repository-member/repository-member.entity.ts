import { RepositoryMember as RepositoryMemberResource } from '@ceres/types';
import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base-entity';
import { CommitAuthor } from '../commit/author/commit-author.entity';
import { Repository } from '../repository.entity';

@Entity('repository_member')
export class RepositoryMember extends BaseEntity<RepositoryMemberResource> {
  @ManyToOne(() => Repository, (repo) => repo.members)
  @JoinColumn({ name: 'repository_id' })
  repository: Repository;

  @OneToMany(() => CommitAuthor, (commitAuthor) => commitAuthor.owner)
  authors: CommitAuthor[];
}
