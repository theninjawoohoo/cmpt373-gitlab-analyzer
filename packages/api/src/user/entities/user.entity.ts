import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

interface SfuAuth {
  type: 'sfu';
  userId: string;
}

export type Auth = SfuAuth;

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('jsonb')
  auth: Auth[];
}
