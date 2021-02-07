import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Repository } from '../../gitlab/repository/repository.entity';

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

  @OneToMany(() => Repository, (repository) => repository.user)
  repositories: Repository[];
}
