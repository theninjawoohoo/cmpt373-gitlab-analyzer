import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { VerifiedUser } from '../types/VerifiedUser';

export const GitlabToken = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest().user as VerifiedUser;
    if (user?.gitlabToken?.expired) {
      throw new UnauthorizedException(
        'Current user does not have a valid gitlab token',
      );
    }
    return user.gitlabToken.token as string;
  },
);
