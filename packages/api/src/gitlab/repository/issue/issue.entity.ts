import { Issue as IssuesResource } from '@ceres/types';
import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base-entity';
import { Repository } from '../repository.entity';
import { Note } from '../note/note.entity';

@Entity('issue')
export class Issue extends BaseEntity<IssuesResource> {
  @ManyToOne(() => Repository, (repository) => repository.issues)
  @JoinColumn({ name: 'repository_id' })
  repository: Repository;

  @OneToMany(() => Note, (note) => note.issue)
  notes: Note[];
}
