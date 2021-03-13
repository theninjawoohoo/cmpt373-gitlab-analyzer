import { Repository as RepositoryResource } from '@ceres/types';
import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base-entity';
import { User } from '../../user/entities/user.entity';
import { MergeRequest } from '../merge-request/merge-request.entity';
import { CommitAuthor } from './commit/author/commit-author.entity';
import { RepositoryMember } from './repository-member/repository-member.entity';
import { Commit } from './commit/commit.entity';
import { Issue } from './issue/issue.entity';

@Entity('repository')
export class Repository extends BaseEntity<RepositoryResource> {
  @ManyToOne(() => User, (user) => user.repositories)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(
    () => RepositoryMember,
    (repositoryMember) => repositoryMember.repository,
  )
  members: RepositoryMember[];

  @OneToMany(() => Commit, (commit) => commit.repository)
  commits: Commit[];

  @OneToMany(() => MergeRequest, (mergeRequest) => mergeRequest.repository)
  mergeRequests: MergeRequest[];

  @OneToMany(() => Issue, (issue) => issue.repository)
  issues: Issue[];

  @OneToMany(() => CommitAuthor, (commitAuthor) => commitAuthor.repository)
  commitAuthors: CommitAuthor[];
}
