import { Query, Resolver } from '@nestjs/graphql';
import { CheckConnectionDTO } from './user/dto/checkConnectionDTO';

@Resolver()
export class AppResolver {
  // to check the connection
  @Query(() => CheckConnectionDTO)
  checkServer(): CheckConnectionDTO {
    return { connectionStatus: 'connected with graphql' };
  }
}
