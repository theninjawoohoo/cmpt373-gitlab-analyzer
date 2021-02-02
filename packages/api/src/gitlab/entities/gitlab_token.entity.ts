import {
  Column,
  Entity,
  JoinTable,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('gitlab_token')
export class GitlabToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => GitlabToken, (user) => user.id)
  @JoinTable()
  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  token: string;

  @Column({ default: false })
  expired: boolean;
}
