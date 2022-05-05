import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { constant } from 'src/common/constant';
import { UserEntity } from 'src/database/entity/user.entity';
import { loginResponseDTO } from 'src/dto/loginResponseDTO';
import { LoginUserDTO } from 'src/dto/LoginUserDTO';
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

  // login into the system
  @Query(() => loginResponseDTO, { description: 'login into the system' })
  async userLogin(
    @Args('UserLoginData') userLoginData: LoginUserDTO,
  ): Promise<loginResponseDTO> {
    const userData = await this.userService.userLogin(userLoginData);
    return { loginMessage: constant.LOGIN_SUCCESSFUL, userData };
  }
}
