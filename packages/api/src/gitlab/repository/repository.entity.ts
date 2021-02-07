import { Repository as RepositoryResource } from '@ceres/types';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/base-entity';
import { User } from '../../user/entities/user.entity';

@Entity('repository')
export class Repository extends BaseEntity<RepositoryResource> {
  @ManyToOne(() => User, (user) => user.repositories)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
