import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { ActivateSession } from './guard/activate.session.guard';
import { GQLAuthGuard } from './guard/gql_authguard';
import { IsAuthenticated } from './guard/isAuthenticated.guard';
import { PassportLocalStrategy } from './passport.local.strategy';
import { SessionSerializer } from './serialize.service';

const authAndPassportProviderList = [
  GQLAuthGuard,
  ActivateSession,
  IsAuthenticated,
  PassportLocalStrategy,
  SessionSerializer,
];

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [...authAndPassportProviderList],
  exports: [...authAndPassportProviderList],
})
export class AuthModule {}
