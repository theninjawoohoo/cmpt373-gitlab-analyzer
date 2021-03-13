import { ScoringConfig as ScoringConfigResource } from '@ceres/types';
import { BaseEntity } from '../common/base-entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Entity('scoring_config')
export class ScoringConfig extends BaseEntity<ScoringConfigResource> {
  @ManyToOne(() => User, (user) => user.scoringConfigs)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
