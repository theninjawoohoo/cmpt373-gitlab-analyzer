import { Commit as CommitResource } from '@ceres/types';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base-entity';
import { Repository } from '../repository.entity';

@Entity('commit')
export class Commit extends BaseEntity<CommitResource> {
  @ManyToOne(() => Repository, (repo) => repo.commits)
  @JoinColumn({ name: 'repository_id' })
  repository: Repository;
}
