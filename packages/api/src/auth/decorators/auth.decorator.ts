import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { VerifiedUser as VerifiedUserType } from '../types/VerifiedUser';

export const Auth = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('User is not authorized');
    }
    return user as VerifiedUserType;
  },
);
