import { GroupConfig as GroupConfigResource } from '@ceres/types';
import { BaseEntity } from '../common/base-entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Entity('group_config')
export class GroupConfig extends BaseEntity<GroupConfigResource> {
  @ManyToOne(() => User, (user) => user.scoringConfigs)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
