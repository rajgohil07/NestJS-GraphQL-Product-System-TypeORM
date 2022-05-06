import { GqlExecutionContext } from '@nestjs/graphql';
import { constant } from 'src/common/constant';
import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export class Logout implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    if (!req.user) {
      throw new UnauthorizedException(constant.UNAUTHORIZED_ACCESS_MESSAGE);
    }
    await req.logout();
    return true;
  }
}
