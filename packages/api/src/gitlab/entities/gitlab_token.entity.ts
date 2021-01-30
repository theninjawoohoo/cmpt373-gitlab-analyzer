import {
  Column,
  Entity,
  JoinTable,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// user is a reserved word in postgres
@Entity('gitlab_token')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.id)
  @JoinTable()
  user_id: string;

  @Column()
  token: string;

  @Column({ default: false })
  expired: boolean;
}
