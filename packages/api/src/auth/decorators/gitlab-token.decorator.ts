import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { VerifiedUser } from '../types/VerifiedUser';

export const GitlabToken = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest().user as VerifiedUser;
    if (!user || !user.gitlabToken) {
      throw new UnauthorizedException(
        'Current user does not have a gitlab token',
      );
    }
    return user.gitlabToken as string;
  },
);
