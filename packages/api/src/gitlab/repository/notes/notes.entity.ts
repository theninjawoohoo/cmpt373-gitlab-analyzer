import { Note as NotesResource } from '@ceres/types';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base-entity';
import { MergeRequest } from '../../merge-request/merge-request.entity';
import { Repository } from '../repository.entity';
import { Issue } from '../issues/issues.entity';

@Entity('notes')
export class Note extends BaseEntity<NotesResource> {
  @ManyToOne(() => Repository, (repo) => repo.notes)
  @JoinColumn({ name: 'repository_id' })
  repository: Repository;

  @ManyToOne(() => MergeRequest, (mergeRequest) => mergeRequest.notes)
  mergeRequest: MergeRequest;

  @ManyToOne(() => Issue, (issue) => issue.notes)
  issue: Issue;
}
