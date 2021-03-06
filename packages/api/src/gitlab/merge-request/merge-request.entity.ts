import { MergeRequest as MergeRequestResource } from '@ceres/types';
import {
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../common/base-entity';
import { Commit } from '../repository/commit/commit.entity';
import { Diff } from '../repository/diff/diff.entity';
import { Repository } from '../repository/repository.entity';
import { MergeRequestParticipant } from './merge-request-participant/merge-request-participant.entity';
import { Note } from '../repository/note/note.entity';

@Entity('merge_request')
export class MergeRequest extends BaseEntity<MergeRequestResource> {
  @ManyToOne(() => Repository, (repository) => repository.mergeRequests)
  @JoinColumn({ name: 'repository_id' })
  repository: Repository;

  @OneToMany(() => Diff, (diff) => diff.mergeRequest)
  diffs: Diff[];

  @ManyToMany(() => Commit, (commit) => commit.mergeRequests)
  @JoinTable()
  commits: Commit[];

  @OneToMany(
    () => MergeRequestParticipant,
    (mergeRequestParticipant) => mergeRequestParticipant.mergeRequest,
  )
  participants: MergeRequestParticipant[];

  @OneToMany(() => Note, (note) => note.mergeRequest)
  notes: Note[];
}
