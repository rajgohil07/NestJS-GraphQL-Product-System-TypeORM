import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { emailAndPasswordValidation } from 'src/common/helper';

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
    /* 
       manual validation due to below issue 
       reference https://github.com/nestjs/passport/issues/129 
    */
    emailAndPasswordValidation(Email, Password);
    const req = ctx.getContext().req;
    req.body.Email = Email;
    req.body.Password = Password;
    return req;
  }
}
