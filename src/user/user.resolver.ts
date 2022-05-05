import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GQLAuthGuard } from 'src/auth/guard/gql_authguard';
import { constant } from 'src/common/constant';
import { User } from 'src/custom_decoder/user.decoder';
import { UserEntity } from 'src/database/entity/user.entity';
import { LoginUserDTO } from 'src/user/dto/LoginUserDTO';
import { RegisterUserDTO } from 'src/user/dto/registerUserDTO';
import { UserService } from './user.service';
import { ActivateSession } from 'src/auth/guard/activate.session.guard';
import { IsAuthenticated } from 'src/auth/guard/isAuthenticated.guard';
import {
  loginResponseDTO,
  UserDecoderData,
} from 'src/user/dto/loginResponseDTO';

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
  @UseGuards(GQLAuthGuard, ActivateSession, IsAuthenticated)
  async userLogin(
    @Args('UserLoginData') userLoginData: LoginUserDTO,
    @User() user: UserDecoderData,
  ): Promise<loginResponseDTO> {
    return { loginMessage: constant.LOGIN_SUCCESSFUL, userData: user };
  }
}
