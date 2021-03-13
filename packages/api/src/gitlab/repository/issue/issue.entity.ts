import { Issue as IssuesResource } from '@ceres/types';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base-entity';
import { Repository } from '../repository.entity';

@Entity('issue')
export class Issue extends BaseEntity<IssuesResource> {
  @ManyToOne(() => Repository, (repository) => repository.issues)
  @JoinColumn({ name: 'repository_id' })
  repository: Repository;
}
