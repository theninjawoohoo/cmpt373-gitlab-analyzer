import { MergeRequest as MergeRequestResource } from '@ceres/types';
import { Entity, JoinColumn, ManyToOne, Column } from 'typeorm';
import { BaseEntity } from '../../common/base-entity';
import { Repository } from '../repository/repository.entity';

@Entity('mergeRequest')
export class MergeRequest extends BaseEntity<MergeRequestResource> {
  @ManyToOne(() => Repository, (repository) => repository.mergerequests)
  @JoinColumn({ name: 'repository_id' })
  repository: Repository;
}
