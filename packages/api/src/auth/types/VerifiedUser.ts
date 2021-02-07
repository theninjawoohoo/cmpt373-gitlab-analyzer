import { User } from '../../user/entities/user.entity';

export interface VerifiedUser {
  sub: string;
  user: User;
  gitlabToken?: string;
}
