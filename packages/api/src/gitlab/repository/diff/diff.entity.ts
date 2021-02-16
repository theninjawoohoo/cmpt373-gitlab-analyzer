import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base-entity';
import { Diff as DiffResource } from '@ceres/types';
import { MergeRequest } from '../../merge-request/merge-request.entity';
import { Commit } from '../commit/commit.entity';

@Entity('diff')
export class Diff extends BaseEntity<DiffResource> {
  @ManyToOne(() => Commit, (commit) => commit.diffs)
  @JoinColumn({ name: 'commit_id' })
  commit?: Commit;

  @ManyToOne(() => MergeRequest, (mergeRequest) => mergeRequest.diffs)
  @JoinColumn({ name: 'merge_request_id' })
  mergeRequest?: MergeRequest;
}
