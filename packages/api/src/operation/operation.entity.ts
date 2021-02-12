import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../common/base-entity';
import { Operation as OperationResource } from '@ceres/types';
import { User } from '../user/entities/user.entity';

@Entity()
export class Operation extends BaseEntity<OperationResource> {
  @ManyToOne(() => User, (user) => user.operations)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
