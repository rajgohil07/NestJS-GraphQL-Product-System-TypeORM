import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserEntity } from 'src/database/entity/user.entity';
import { RegisterUserDTO } from 'src/dto/registerUserDTO';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // to register the user into the system
  @Mutation(() => UserEntity, {
    description: 'to register the user into the system',
  })
  registerUser(
    @Args('registerUser') registerUser: RegisterUserDTO,
  ): Promise<UserEntity> {
    return this.userService.registerUser(registerUser);
  }
}
