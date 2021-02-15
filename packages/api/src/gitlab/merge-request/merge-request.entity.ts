import { MergeRequest as MergeRequestResource } from '@ceres/types';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/base-entity';
import { Repository } from '../repository/repository.entity';

@Entity('merge_request')
export class MergeRequest extends BaseEntity<MergeRequestResource> {
  @ManyToOne(() => Repository, (repository) => repository.mergeRequests)
  @JoinColumn({ name: 'repository_id' })
  repository: Repository;
}
