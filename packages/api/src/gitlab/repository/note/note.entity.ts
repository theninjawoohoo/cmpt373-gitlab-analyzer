import { Note as NotesResource } from '@ceres/types';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base-entity';
import { MergeRequest } from '../../merge-request/merge-request.entity';
// import { Issue } from '../issues/issues.entity';

@Entity('merge_request_note')
export class Note extends BaseEntity<NotesResource> {
  @ManyToOne(() => MergeRequest, (mergeRequest) => mergeRequest.notes)
  @JoinColumn({ name: 'merge_request_id' })
  mergeRequest: MergeRequest;
}
