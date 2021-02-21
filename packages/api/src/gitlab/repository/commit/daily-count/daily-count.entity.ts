import { Commit } from '@ceres/types';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../../common/base-entity';

@Entity('commit_daily_count')
export class CommitDailyCount extends BaseEntity<Commit.DailyCount> {
  @Column({ name: 'repository_id', type: 'text' })
  repositoryId: string;
}
