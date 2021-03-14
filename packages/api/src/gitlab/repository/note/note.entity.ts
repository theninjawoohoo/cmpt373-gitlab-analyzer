import { Note as NotesResource } from '@ceres/types';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base-entity';
import { MergeRequest } from '../../merge-request/merge-request.entity';
import { Issue } from '../issue/issue.entity';

@Entity('note')
export class Note extends BaseEntity<NotesResource> {
  @ManyToOne(() => MergeRequest, (mergeRequest) => mergeRequest.notes)
  @JoinColumn({ name: 'merge_request_id' })
  mergeRequest: MergeRequest;

  @ManyToOne(() => Issue, (issue) => issue.notes)
  @JoinColumn({ name: 'issue_id' })
  issue: Issue;

  @Column({ name: 'word_count', nullable: true, type: 'integer' })
  wordCount: number;
}
