import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { VerifiedUser } from '../types/VerifiedUser';

export const VerifedUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user as VerifiedUser;
  },
);
