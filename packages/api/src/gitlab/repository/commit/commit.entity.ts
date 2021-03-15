import { Commit as CommitResource } from '@ceres/types';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../../common/base-entity';
import { MergeRequest } from '../../merge-request/merge-request.entity';
import { Diff } from '../diff/diff.entity';
import { Repository } from '../repository.entity';

@Entity('commit')
export class Commit extends BaseEntity<CommitResource> {
  @ManyToOne(() => Repository, (repo) => repo.commits)
  @JoinColumn({ name: 'repository_id' })
  repository: Repository;

  @OneToMany(() => Diff, (diff) => diff.commit)
  diffs: Diff[];

  @ManyToMany(() => MergeRequest, (mergeRequest) => mergeRequest.commits)
  mergeRequests: MergeRequest[];

  @Column({ nullable: true, type: 'float' })
  score: number;
}
