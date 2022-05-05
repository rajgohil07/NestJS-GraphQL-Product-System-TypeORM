import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { constant } from 'src/common/constant';
import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export class IsAuthenticated implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = GqlExecutionContext.create(context).getContext().req;
    const authenticated: boolean = req.isAuthenticated();
    if (authenticated) {
      return authenticated;
    }
    throw new UnauthorizedException(constant.UNAUTHORIZED_ACCESS_MESSAGE);
  }
}
