import { Commit as CommitResource } from '@ceres/types';
import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base-entity';
import { Diff } from '../diff/diff.entity';
import { Repository } from '../repository.entity';

@Entity('commit')
export class Commit extends BaseEntity<CommitResource> {
  @ManyToOne(() => Repository, (repo) => repo.commits)
  @JoinColumn({ name: 'repository_id' })
  repository: Repository;

  @OneToMany(() => Diff, (diff) => diff.commit)
  diffs: Diff[];
}
