import { Note as NotesResource } from '@ceres/types';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base-entity';
import { MergeRequest } from '../../merge-request/merge-request.entity';
import { Repository } from '../repository.entity';
import { Issue } from '../issues/issues.entity';

@Entity('notes')
export class Note extends BaseEntity<NotesResource> {
  @ManyToOne(() => MergeRequest, (mergeRequest) => mergeRequest.notes)
  mergeRequest: MergeRequest;
}
