import { GitlabToken } from '../../gitlab/entities/gitlab-token.entity';
import { User } from '../../user/entities/user.entity';

export interface VerifiedUser {
  sub: string;
  user: User;
  gitlabToken?: GitlabToken;
}
