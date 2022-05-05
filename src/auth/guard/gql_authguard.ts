import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GQLAuthGuard extends AuthGuard('local') {
  constructor() {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const {
      UserLoginData: { Email, Password },
    } = ctx.getArgs();
    const req = ctx.getContext().req;
    req.body.Email = Email;
    req.body.Password = Password;
    return req;
  }
}
