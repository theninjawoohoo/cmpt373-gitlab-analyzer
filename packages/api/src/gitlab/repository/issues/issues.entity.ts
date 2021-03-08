import { Issue as IssuesResource } from '@ceres/types';
import { Entity } from 'typeorm';
import { BaseEntity } from '../../../common/base-entity';

@Entity('issue')
export class Issue extends BaseEntity<IssuesResource> {}
