import { MergeRequest as MergeRequestResource } from '@ceres/types';
import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base-entity';
import { Diff } from '../repository/diff/diff.entity';
import { Repository } from '../repository/repository.entity';

@Entity('merge_request')
export class MergeRequest extends BaseEntity<MergeRequestResource> {
  @ManyToOne(() => Repository, (repository) => repository.mergeRequests)
  @JoinColumn({ name: 'repository_id' })
  repository: Repository;

  @OneToMany(() => Diff, (diff) => diff.mergeRequest)
  diffs: Diff[];
}
