import { Profile } from '@ceres/types';
import { ScoringConfig } from '../../scoring/scoring-config/scoring-config.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Repository } from '../../gitlab/repository/repository.entity';
import { Operation } from '../../operation/operation.entity';

interface SfuAuth {
  type: 'sfu';
  userId: string;
}

export type Auth = SfuAuth;

// user is a reserved word in postgres
@Entity('user_profile')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('jsonb')
  auth: Auth;

  @Column({ type: 'jsonb', nullable: true })
  profile?: Profile;

  @OneToMany(() => Repository, (repository) => repository.user)
  repositories: Repository[];

  @OneToMany(() => Operation, (operation) => operation.user)
  operations: Operation[];

  @OneToMany(() => ScoringConfig, (scoringConfig) => scoringConfig.user)
  scoringConfigs: ScoringConfig[];
}
