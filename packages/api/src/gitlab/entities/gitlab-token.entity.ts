import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('gitlab_token')
export class GitlabToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'text' })
  userId: string;

  @Column({ type: 'text' })
  token: string;

  @Column({ default: false })
  expired: boolean;
}
