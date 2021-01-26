import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
