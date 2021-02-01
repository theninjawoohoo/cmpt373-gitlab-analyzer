import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { VerifiedUser } from '../types/VerifiedUser';

export const GitlabToken = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest().user as VerifiedUser;
    if (!user || !user.gitlabToken) {
      throw new Error('Current user does not have a gitlab token');
    }
    return user.gitlabToken as string;
  },
);
